import * as path from 'path';

import { BaseBuilder } from './base';
import { File, FileInfo } from '../template';
import { Hay } from '../hay';

const FILENAME_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})-([-\w]+?)\.(\w+)?$/i;

export class LayoutsBuilder extends BaseBuilder {
  public template: string;

  constructor(hay: Hay) {
    super(hay);

    super.setConfig({
      name: 'layout',
      directory: hay.config.values.layoutsDir,
      fileExtensions: hay.config.values.layoutExtensions
    });
  }

  public async parseFile(file: File): Promise<any> {
    let info: FileInfo = await this.hay.engine.extractInfo(file);
    info.noCompile = true;
    info.namespace = 'layouts:';
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
    this.hay.reporter.finish(`<green>✓</green>  compiled layouts`);
  }
}
