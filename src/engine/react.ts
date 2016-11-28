import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import * as uglify from 'uglify-js';

import { Hay } from '../hay';
import { TemplateEngine, FileInfo } from '../template';
import invariant from '../invariant';

const REQUIRE_REGEX = /(var\s)(\w+)(\s?=\s?)require(\(['"])([^]*?)(['"]\))(;?)/gi;

let id: number = 0;
const CACHE: Map<string, ReactTemplate> = new Map<string, ReactTemplate>();

export class ReactTemplate {
  public template: any;
  public code: string;
  public id: string = `hay${++id}`;

  constructor(public info: FileInfo, public hay: Hay) {
    CACHE.set(info.namespace + info.shortName, this);
    CACHE.set(info.namespace + info.fileName, this);

    if (info.contents) {
      this.code = this.transpileCode(info.contents);
      this.code = this.transformImports(this.code, this.info.path);

      eval(this.code);

      this.template = exports.default;
    }
  }

  public transpileCode(code: string): string {
    const transformedCode: ts.TranspileOutput = ts.transpileModule(
      code,
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES5,
          jsx: ts.JsxEmit.React
        },
        moduleName: this.id
      }
    );

    return transformedCode.outputText;
  }

  public transformImports(contents: string, cwd: string): string {
    return contents.replace(REQUIRE_REGEX, (...matches: any[]) => {
      const requirePath: string = matches[5];

      if (requirePath[0] !== '.') {
        return '';
      }

      const resolvedPath: string = `${path.resolve(cwd, requirePath)}.tsx`;

      let contents = fs.readFileSync(resolvedPath);
      let transformedCode: string = this.transpileCode(contents.toString());
      transformedCode = this.transformImports(
        transformedCode,
        path.dirname(path.resolve(cwd, requirePath))
      );

      return [
        transformedCode,
        matches[1],
        matches[2],
        matches[3],
        `{ 'default': exports.default }`,
        matches[7] || ';',
        'exports={};'
      ].join('');
    });
  }

  public async render(data: any): Promise<string> {
    if (!this.template) {
      this.template = 'div';
    }
    let compiledTemplate: any = React.createElement(this.template, data);

    let code: string = `${data.code || ''}${this.code};components.${this.id}=React.createElement(exports.default, {options:${JSON.stringify(data.options)}});`;

    if (this.info.options && this.info.options.layout) {
      let parentTemplateName: string = this.info.options.layout;
      let parentFileName: string = 'layouts:' + parentTemplateName;

      invariant(
        CACHE.has(parentFileName),
        `cannot find layout for ${this.info.fileName}`
      );

      let parentTemplate: ReactTemplate = <ReactTemplate> CACHE.get(parentFileName);

      return await parentTemplate.render(Object.assign({}, data, {
        page: data.page || this.info.options,
        content: compiledTemplate,
        code,
        contentId: this.id
      }));
    }

    const originalLog = console.log;
    console.log = function () {};

    let html: string = ReactDOMServer.renderToString(compiledTemplate);

    console.log = originalLog;

    html = html.replace(/<\/html>/g, '');
    html = html.replace(/<\/body>/g, '');

    let googleAnalytics: string = '';
    if (this.hay.config.values.googleAnalytics) {
      googleAnalytics = `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','${this.hay.config.values.googleAnalytics}','auto');ga('send','pageview');</script>`;
    }

    return `<!doctype html>${html}<script src="/react.min.js"></script><script src="/react-dom.min.js"></script><script>var exports={};var components={};${uglify.minify(code, { fromString: true }).code};ReactDOM.render(React.createElement(exports.default,{content:components.${data.contentId}}),document);</script>${googleAnalytics}</body></html>`;
  }
}

export class ReactTemplateEngine extends TemplateEngine {
  private hasCopiedReact: boolean = false;

  constructor(hay: Hay) {
    super(hay);
  }

  public async compileTemplate(info: FileInfo): Promise<ReactTemplate> {
    if (!this.hasCopiedReact) {
      this.hasCopiedReact = true;
      const nodeModules: string = path.resolve(__dirname, '../../node_modules');

      const { destination } = this.hay.config.values;

      this.hay.fileSystem.copy(
        path.resolve(nodeModules, 'react/dist/react.min.js'),
        path.resolve(destination, 'react.min.js')
      );
      this.hay.fileSystem.copy(
        path.resolve(nodeModules, 'react-dom/dist/react-dom.min.js'),
        path.resolve(destination, 'react-dom.min.js')
      );
    }
    return new ReactTemplate(info, this.hay);
  }
}

Hay.registerTemplateEngine('react', ReactTemplateEngine);
