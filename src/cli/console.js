// @flow
import ansi from 'ansi-styles';
import leftPad from 'left-pad';
import readline from 'readline';
import emojis from 'node-emoji';
import progress from 'progress';

type ProgressBarTick = (step: number,
                        total: number,
                        message: string,
                        ...category: string[]) => void;

const TAG_REGEX = /(?:<)([\/])?(\w*?)(?:>)/gi;

export class Console {
  /**
   * Progress Bar
   */
  progressBar = {
    format: this.parseMessage(`<magenta>:category</magenta> [<green>:bar</green>] <green><bold>:percent</bold></green> <white>:message</white>`),
    options: {
      width: 30,
      total: 100,
      complete: '=',
      incomplete: ' ',
      clear: true
    }
  };

  /**
   * Console interaction methods
   */
  stderr = this.createOutput('stderr');
  stdout = this.createOutput('stdout');

  types = {};
  /**
   * Common logging methods
   */
  error = this.stderr('<red>error</red>');
  success = this.stdout('<green>success</green>');
  log = this.stdout();

  createMessage(...message: (string | Function)[]): string {
    function callOrReturn(item: any): boolean {
      if (typeof item === 'function') {
        return item();
      }
      return item;
    }
    return this.parseMessage([...message].filter(callOrReturn).join(' '));
  }

  createOutput(type: 'stderr' | 'stdout') {
    return (prefix: string = '') => (...message: (string | Function)[]) => {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);

      let func = type === 'stderr' ? process.stderr : process.stdout;
      func.write(`${this.createMessage(prefix, ...message)}\n`);
    };
  }

  createProgressBar(): ProgressBarTick {
    let progressBar = new progress(this.progressBar.format, this.progressBar.options);

    return (step: number, total: number, message: string, ...category: string[]) => {
      progressBar.update(step / total, {
        message,
        category: leftPad(this.createMessage(...category), 15)
      });
    };
  }

  emoji(name: string): string {
    let emoji = emojis.get(name);
    return emoji && `${emoji} ` || '';
  }

  parseMessage(message: string): string {
    return message.replace(TAG_REGEX, function (match, closed, name) {
      let target = closed ? 'close' : 'open';
      return ansi[name][target];
    });
  }

  step(current: number, total: number, ...message: string[]) {
    return this.log(`<dim>[${current}/${total}] ${this.createMessage(...message)}</dim>`);
  }
}
