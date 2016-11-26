import * as path from 'path';

import { BaseBuilder } from './base';
import { File, FileInfo } from '../template';
import { Hay } from '../hay';

export class PartialsBuilder extends BaseBuilder {
  public template: string;

  constructor(hay: Hay) {
    super(hay);

    super.setConfig({
      name: 'partial',
      directory: hay.config.values.partialsDir,
      fileExtensions: hay.config.values.partialExtensions
    });
  }

  async parseFile(file: File): Promise<any> {
    let info: FileInfo = await this.hay.engine.extractInfo(file);
    info.noCompile = true;

    await this.hay.engine.compileTemplate(info);
  }

  async removeFile(file: File): Promise<any> {
    let shortName: string = path.basename(file.fileName);
  }

  async run(): Promise<any> {
    let files: File[] = await super.loadFiles();

    return Promise.all(files.map(async (file: File) => await this.parseFile(file)));
  }

  public finish() {
    this.hay.reporter.finish(`<green>✓</green>  gathered partials`);
  }
}
