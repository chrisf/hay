import * as marked from 'marked';
import { AllHtmlEntities, Entities } from 'html-entities';

import { Hay } from '../hay';
import invariant from '../invariant';
import { TemplateParser, FileInfo } from '../template';

const highlighters: { [x: string]: (code: any, lang: string, callback: Function) => any } = {
  'highlight.js': (code, lang) => {
    return require('highlight.js').highlight(lang, code).value;
  },
  'pygemntize': (code, lang, callback) => {
    return require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err: any, result: any) {
      callback(err, result.toString());
    });
  }
};

export class MarkedTemplateParser extends TemplateParser {
  private entities: Entities;
  constructor(hay: Hay) {
    super(hay);

    this.entities = new AllHtmlEntities();
    this.configure();
  }

  public async run(info: FileInfo): Promise<FileInfo> {
    let mdExtensions: string[] = this.hay.config.values.markdownExtensions;

    if (info.fileExt && mdExtensions.includes(info.fileExt)) {
      return new Promise<FileInfo>((resolve, reject) => {
        if (!info.contents) {
          info.contents = '';
        }
        marked(info.contents, (err: any, content: string) => {
          if (err) return reject(err);

          info.contents = this.entities.decode(content);
          resolve(info);
        });
      });
    } else {
      return info;
    }
  }

  private configure() {
    const highlight = highlighters[this.hay.config.values.highlighter];

    invariant(
      highlight,
      `cannot find highlighter ${this.hay.config.values.highlighter}`
    );

    marked.setOptions({
      gfm: this.hay.config.values.gfm,
      tables: this.hay.config.values.gfm,
      highlight,
      sanitize: false
    });
  }
}

Hay.registerTemplateParser('marked', MarkedTemplateParser);
