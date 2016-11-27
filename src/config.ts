import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Reporter } from './reporter';

const CONFIG_NAMES: string[] = [
  'hay.config.js',
  'hay.config.json',
  'hay.config.yml',
  'config.yml'
];

export interface ConfigValues {
  autoPermalink: boolean;
  destination: string;
  engine: string;
  exclude: string[];
  highlighter: string;
  markdownExtensions: string[];
  parsers: string[];
  partialsDir: string;
  partialExtensions: string[];
  layoutsDir: string;
  layoutExtensions: string[];
  lrPort: number,
  gfm: boolean;
  noProgress: boolean;
  pluginsDir: string[];
  pluginsFormat: string[];
  port: number;
  postsDir: string;
  postExtensions: string[];
  postOutput: string;
  source: string;
  suppressLevel: number;
  webpackConfig: string;
  [x: string]: any;
};

const values: ConfigValues = {
  autoPermalink: true,
  destination: 'build',
  engine: 'nunjucks',
  exclude: [],
  highlighter: 'highlight.js',
  layoutsDir: '_layouts',
  layoutExtensions: ['html'],
  lrPort: 35729,
  markdownExtensions: ['md'],
  parsers: ['marked'],
  partialsDir: '_partials',
  partialExtensions: ['html'],
  pluginsDir: ['{hay}', '{cwd}/node_modules'],
  pluginsFormat: ['hay-{prefix}-{name}', 'hay-{name}'],
  gfm: true,
  noProgress: false,
  port: 3000,
  postsDir: '_posts',
  postExtensions: ['md'],
  postOutput: 'directory',
  source: '.',
  suppressLevel: 0,
  webpackConfig: ''
};

interface ConfigLoaders {
  [x: string]: (filename: string) => any;
}

export class Config {
  public reporter: Reporter;
  public values: ConfigValues = values;
  public webpackConfig: any;
  public webpackMiddlewareInstance: any;
  public webpackCompilerInstance: any;

  public async loadConfig(overrideObj: any = {}): Promise<any> {
    let files: ConfigValues[] = await Promise.all(CONFIG_NAMES.map((fileName: string) => this.loadFile(fileName)));
    files = files.filter((item: any) => !!item);

    files.map((file: ConfigValues) => {
      Object.keys(values).forEach((item: string) => {
        if (overrideObj[item]) {
          file[item] = overrideObj[item];
        }
      });
      return file;
    });

    await Promise.all(files.map((file: any) => this.addToSelf(file)));
    return this.loadPlugins();
  }

  public logInfo(reporter: any) {
    reporter({gutterStyles: ['white'], gutterText: 'hay config', hideColons: true})('');

    reporter({
      gutter: {
        styles: ['gray'],
        text: 'source'
      }
    })(`<dim>${this.values.source}</dim>`);
    reporter({
      gutter: {
        styles: ['gray'],
        text: 'posts'
      }
    })(`<dim>${this.values.postsDir}</dim>`);
    reporter({
      gutter: {
        styles: ['gray'],
        text: 'layouts'
      }
    })(`<dim>${this.values.layoutsDir}</dim>`);
    reporter({
      gutter: {
        styles: ['gray'],
        text: 'partials'
      }
    })(`<dim>${this.values.partialsDir}</dim>\n`);
    reporter({
      gutter: {
        styles: ['gray'],
        text: 'destination'
      }
    })(`<dim>${this.values.destination}</dim>\n`);
  }

  public resolvePaths() {
    let cwd: string = process.cwd();

    this.values.source = path.resolve(cwd, this.values.source);
    this.values.postsDir = path.resolve(this.values.source, this.values.postsDir);
    this.values.layoutsDir = path.resolve(this.values.source, this.values.layoutsDir);
    this.values.partialsDir = path.resolve(this.values.source, this.values.partialsDir);
    this.values.destination = path.resolve(cwd, this.values.destination);
  }

  public setReporter(reporter: Reporter) {
    this.reporter = reporter;
  }

  private addToSelf(config: { [x: string]: any }) {
    for (let i in config) {
      if (Object.prototype.hasOwnProperty.call(config, i)) {
        this.values[i] = config[i];
      }
    }
    return this;
  }

  private async loadPlugins() {
    type pluginToLoad = {
      prefix: string,
      name: string,
      loaded: boolean,
      files?: string[]
    };

    let pluginsToLoad: pluginToLoad[] = [];

    // template engine
    pluginsToLoad.push({ prefix: 'engine', name: this.values.engine, loaded: false });
    // template parser
    pluginsToLoad.push(...this.values.parsers.map((parser: string) => {
      return { prefix: 'parser', name: parser, loaded: false };
    }));

    let directories: string[] = this.values.pluginsDir.map(
      (dir: string) => {
        return dir
          .replace(/{cwd}/gi, process.cwd)
          .replace(/{hay}/gi, __dirname);
      });

    const merge = ([first, ...rest]): string[] => {
      if (!first) {
        return [];
      } else if (!Array.isArray(first)) {
        return [first, ...merge(rest)];
      } else {
        return [...merge(first), ...merge(rest)];
      }
    }

    const combine = (join: string, ...args: string[][]): string[] => {
      return [].concat(
        ...(<any> args).reduce((into: string[], from: string[]) => {
          return merge(into.map((nextKey: string) => {
            return from.map((fromKey: string) => {
              return [nextKey, fromKey].join(join);
            })
          }));
        })
      );
    }

    pluginsToLoad.forEach((plugin: pluginToLoad) => {
      let folderNames: string[] = this.values.pluginsFormat.map((format: string) => {
        return format
          .replace(/{prefix}/gi, plugin.prefix)
          .replace(/{name}/gi, plugin.name);
      });

      let files: string[] = merge([
        // directory {dir}/{format}
        combine('/', directories, folderNames),
        // directory {dir}/{prefix}/{name}
        combine('/', directories, [plugin.prefix], [plugin.name]),
        // directory {dir}/{name}
        combine('/', directories, [plugin.name]),
        // directory {dir}/{prefix}/{format}
        combine('/', directories, combine('/', [plugin.prefix], folderNames)),
        // directory {dir}/{format}/{prefix}
        combine('/', directories, combine('/', folderNames, [plugin.prefix]))
      ]);

      // allow the file.js as well as the file/ directory
      files = combine('', files, ['.js', '']);

      files.forEach((file: string) => {
        if (plugin.loaded) {
          return;
        }

        try {
          require(file);
          plugin.loaded = true;
        } catch(e) { }
      });
    });

    const webpackConfig: any = this.values.webpackConfig;
    if (!!webpackConfig) {
      try {
        this.webpackConfig = require(path.resolve(process.cwd(), webpackConfig));
      } catch(e) {
        throw `could not find webpack config at ${webpackConfig}`;
      }
    }
  }

  private async loadFile(filename: string): Promise<any> {
    return new Promise(async(resolve) => {
      let loaders: ConfigLoaders = {
        async yml(filename) {
          return new Promise((resolve) => {
            let result: any;
            try {
              fs.readFile(path.resolve(process.cwd(), filename), (err: any, contents: Buffer) => {
                try {
                  result = yaml.safeLoad(contents.toString());
                } catch (e) {
                  resolve();
                }
                resolve(result);
              });
            } catch (e) {
              resolve();
            }
          });
        },
        async js(filename) {
          return new Promise((resolve) => {
            let result: any;
            try {
              result = require(path.join(process.cwd(), `./${filename}`));
              resolve(result);
            } catch (e) {
              resolve();
            }
          });
        },
        async json(filename) {
          return this.js(filename);
        }
      };

      let ext = 'js';
      let result = loaders[ext] && loaders[ext](filename);

      if (result) {
        return resolve(result);
      }
      resolve();
    });
  }
}
