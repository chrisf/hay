import * as commander from 'commander';
import * as express from 'express';
import * as tinylr from 'tiny-lr';

import { Hay } from '../hay';
import { BaseCommand } from './base';
import { BaleCommand } from './bale';

export class ServeCommand extends BaseCommand {
  public baleCommand: BaleCommand;
  public server: express.Express;
  public hay.config.webpackMiddlewareInstance: any;

  constructor(hay: Hay) {
    super(hay);

    this.baleCommand = new BaleCommand(this.hay);
  }

  static options(commander: commander.ICommand) {
    commander.usage('bale [flags]');
    commander.option('--watch', 'watch for changes');
  }

  public async run() {
    let server: any = express();

    if (this.hay.config.webpackConfig) {
      this.hay.reporter.log('');

      await this.baleCommand.watch();

      const webpack: any = require('webpack');
      const webpackMiddleware: any = require('webpack-dev-middleware');
      const hotMiddleware: any = require('webpack-hot-middleware');

      let webpackLogger = this.hay.reporter.i({ gutter: { styles: ['cyan'], text: 'webpack' } });

      webpackLogger('initialising\n');

      let webpackCompilerInstance = webpack(this.hay.config.webpackConfig);
      let webpackMiddlewareInstance = webpackMiddleware(
        webpackCompilerInstance,
        {
          publicPath: '/',
          log: (message: string) => {
            this.hay.reporter.log('');
            this.hay.reporter.info(message);
          },
          stats: 'errors-only',
          noInfo: true,
          serverSideRender: false
        }
      );

      server.use(webpackMiddlewareInstance);

      let hmrLogger = this.hay.reporter.i({
        gutter: {
          styles: ['magenta'],
          text: 'HMR'
        }
      });

      server.use(hotMiddleware(
        webpackCompilerInstance,
        {
          noInfo: true,
          reload: true,
          log: (message: string) => {
            hmrLogger(message);
            this.hay.reporter.log('');
          },
          path: '/__webpack_hmr',
          heartbeat: 10 * 1000,
          stats: 'errors-only'
        }
      ));

      let reloadLogger = this.hay.reporter.i({ gutter: { styles: ['yellow'], text: 'reloader' } });

      this.hay.server = tinylr();

      this.hay.server.listen(this.hay.config.values.lrPort, () => {
        this.hay.reporter.log('');
        reloadLogger('started');
      });
    }

    const port: number = this.hay.config.values.port;

    server.use(express.static(this.hay.config.values.destination));
    server.listen(port);

    this.hay.reporter.info(`running local server at http://localhost:${port}`);
  }
}
