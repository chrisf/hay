import * as path from 'path';

import { Hay } from '../hay';
import { BaseBuilder } from '../build/base';
import { File } from "../template";

export interface CommandConfig {
  name: string;
  directory: string;
}

export abstract class BaseCommand {
  private config: CommandConfig;
  private count: number = 0;
  public WATCH_INITIATED: boolean = false;

  constructor(public hay: Hay) { }

  public async loadFile(file: string): Promise<File> {
    let contents = await this.hay.fileSystem.readFile(file);

    return new Promise<File>((resolve) => {
      resolve({
        contents,
        fileName: path.basename(file)
      });
    });
  }

  public async queue(items: BaseBuilder[]) {
    this.count = 0;
    let length: number = items.length;

    type command = (task: BaseBuilder) => Promise<void>;
    const callCommand: command = async (task: BaseBuilder) => {
      this.hay.reporter.step(++this.count, length, `${task.config.name}s`);

      await task.run();
      task.finish();
    };

    return items.reduce(
      (item: Promise<void>, task: BaseBuilder) => item.then(() => callCommand(task)),
      Promise.resolve()
    );
  }

  public async watch(items: BaseBuilder[]) {
    let hasWarnings: boolean = false;

    items.forEach((item: BaseBuilder) => {
      if (item.watch) {
        item.watch();

        return;
      }

      hasWarnings = true;
      // this.hay.reporter.info(`no watcher for ${item.config.name}`);
    });

    if (hasWarnings) {
      // this.hay.reporter.log('');
    }
  }
}
