import * as ansi from 'ansi-styles';
import * as progress from 'progress';
import * as readline from 'readline';

const TAGREGEX = /(?:<)([\/])?(\w*?)(?:>)/gi;

var cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

/**
 * from left-pad on npm but they don't have a DefinitelyTyped file
 * and I'm lazy so it's easier to just include the function here
 */
function leftPad(str: string, len: number, ch?: string | number) {
  str = str + '';
  len = len - str.length;
  if (len <= 0) return str;
  if (!ch && ch !== 0) ch = ' ';
  ch = ch + '';
  if (ch === ' ' && len < 10) return cache[len] + str;
  var pad = '';
  while (true) {
    if (len & 1) pad += ch;
    len >>= 1;
    if (len) ch += ch;
    else break;
  }
  return pad + str;
}

export type GutterOptions = {
  adjust?: number,
  color: string,
  hideColons?: boolean,
  text: string
};

export enum LOG_LEVEL {
  None,
  Error,
  Warning,
  Info,
  Log,
  Success
};

export type OutputSettings = {
  output?: NodeJS.WritableStream,
  gutter?: {
    styles?: string[],
    text?: string,
    adjust?: number
  },
  logLevel?: typeof LOG_LEVEL,
  hideColons?: boolean,
  noNewLine?: boolean,
  [x: string]: any
};

export type ReporterOptions = {
  suppressLevel: number
};

export type outputArgs = OutputSettings | string;
export type outputCurry = (arg: outputArgs) => outputCurry;

export class Reporter {
  public gutterWidth: number = 15;
  public suppressLevel: number;

  /**
   * Helper output functions
   */
  public stderr  = this.createOutput({ output: process.stderr });
  public stdout  = this.createOutput({ output: process.stdout });

  /**
   * Helper logging functions
   */
  public error   = this.stderr({ level: LOG_LEVEL.Error })({ gutter: { styles: ['red'], text: 'error' } });
  public log     = this.stdout({ level: LOG_LEVEL.Log });
  public i       = this.stdout({ level: LOG_LEVEL.Info });
  public success = this.stdout({ level: LOG_LEVEL.Success })({ gutter: { styles: ['green'], text: 'success' } });
  public warning = this.stdout({ level: LOG_LEVEL.Warning })({ gutter: { styles: ['yellow'], text: 'warning' } });

  /**
   * Helper info level functions
   */
  public finish  = this.i({ gutter: { styles: ['green'], text: '  ' }, hideColons: true });
  public gutter  = this.i({ gutter: { styles: ['gray'] } });
  public info    = this.i({ gutter: { styles: ['blue'], text: 'info' } });

  public constructor(options: ReporterOptions) {
    this.suppressLevel = options.suppressLevel;
  }

  public clear() {
    readline.clearLine(process.stdout, 0);
    (<any> readline.cursorTo)(<NodeJS.WritableStream> process.stdout, 0);
  }

  public createMessage(gutter: GutterOptions, message: string = ''): string {
    if (!gutter || !gutter.text) {
      return this.parseTags(message);
    }
    gutter.adjust = -this.gutterWidth;
    return `${this.createGutter(gutter)} ${this.parseTags(message)}`;
  }

  public step(number: number, total: number, message: string) {
    return this.gutter({ gutter: { styles: ['gray'], text: `${number}/${total}` } })(`<dim>${message}</dim>`);
  }

  private addColor(message: string, color: string) {
    if (!Object.prototype.hasOwnProperty.call(ansi, color)) {
      throw `color ${color} doesn't exist`;
    }
    let ansiColor: ansi.EscapeCodePair = (<any> ansi)[color];
    return `${ansiColor.open}${message}${ansiColor.close}`;
  }

  private createGutter(options: GutterOptions): string {
    let width: number = this.gutterWidth;
    if (options.adjust) {
      width += options.adjust;
    }

    let gutter = this.addColor(leftPad(options.text, width), options.color);

    if (!options.hideColons) {
      gutter += this.parseTags(' <gray>::</gray>');
    }

    return gutter;
  }

  private createOutput(arg: outputArgs): outputCurry {
    const { addColor, parseTags, gutterWidth } = this;

    function resolver(): (args: outputArgs) => outputCurry {
      let args: outputArgs[] = Array.prototype.slice.call(arguments);

      if (typeof args[args.length - 1] === 'string') {
        let message = args.pop();


        let settings: OutputSettings = Object.assign({}, ...args);

        let gutter = '';
        if (settings.gutter && settings.gutter.text) {
          gutter = leftPad(settings.gutter.text, gutterWidth + (settings.gutter.adjust || 0));

          if (settings.gutter.styles) {
            settings.gutter.styles.forEach((color) => gutter = addColor(gutter, color));
          }

          if (settings.hideColons) {
            gutter += '    ';
          } else {
            gutter += addColor(' :: ', 'grey');
          }
        }

        message = parseTags(message);

        if (!settings.noNewLine) {
          message += '\n';
        }

        readline.clearLine(<NodeJS.WritableStream> settings.output, 0);
        (<any> readline.cursorTo)(<NodeJS.WritableStream> settings.output, 0);

        (<NodeJS.WritableStream> settings.output).write(gutter + message);

        return function (): outputCurry {
          throw `cannot call curry after it's been initialised`;
        };
      }

      return function (arg: outputArgs): outputCurry {
        return resolver.apply(this, args.concat(Array.prototype.slice.call(arguments)));
      };
    }

    return resolver.call(this, arg);
  }

  private parseTags(text: any): string {
    if (typeof text === 'string') {
      return text.replace(TAGREGEX, function (match, closed, color) {
        if (!Object.prototype.hasOwnProperty.call(ansi, color)) {
          return match;
        }
        let target = closed ? 'close' : 'open';
        return (<any> ansi)[color][target];
      });
    }
    return '';
  }
}
