import * as path from 'path';

import { Hay } from '../hay';
import { File } from '../template';
import { ProgressBar } from '../reporter';

export type BuilderConfig = {
  directory: string,
  fileExtensions: string[],
  name: string
};

export abstract class BaseBuilder {
  public config: BuilderConfig;
  public progressBar: ProgressBar;
  public WATCH_INITIATED: boolean = false;

  constructor(public hay: Hay) {
    this.progressBar = this.hay.reporter.createProgressBar();
  }

  public abstract finish(): void;

  public async loadFile(fileName: string): Promise<File> {
    return this.hay.fileSystem
      .readFile(path.resolve(this.config.directory, fileName))
      .then((contents: string): File => {
        this.progressBar.tick(`loaded ${fileName}`);

        return {
          fileName,
          contents
        };
      });
  }

  public async loadFiles(): Promise<File[]> {
    let files: string[] = await this.hay.fileSystem.readDir(this.config.directory);
    files = files.filter(this.checkExtensions(this.config.fileExtensions));

    this.progressBar.setLength(files.length);
    this.progressBar.setCategory(`load ${this.config.name}`);
    this.progressBar.start();

    return Promise.all(files.map(async (fileName: string) => this.loadFile(fileName)));
  }

  public abstract run(): any;

  public setConfig(config: BuilderConfig) {
    this.config = config;
  }

  private checkExtensions(extensions: string[]): (file: string) => boolean {
    return (file: string) => extensions.includes(this.hay.fileSystem.getFileExtension(file));
  }

  async watch?(): Promise<void>;
}
