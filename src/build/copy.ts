import * as path from 'path';
import * as glob from 'glob';

import { BaseBuilder } from './base';
import { File, FileInfo, FileParsed } from '../template';
import { Hay, HayFileSystem } from '../hay';
import { ConfigValues } from '../config';

export class CopyBuilder extends BaseBuilder {
  public template: string;

  constructor(hay: Hay) {
    super(hay);

    this.progressBar = this.hay.reporter.createProgressBar();

    super.setConfig({
      name: 'file',
      directory: hay.config.values.source,
      fileExtensions: []
    });
  }

  async loadOtherFiles(): Promise<string[]> {
    let config: ConfigValues = this.hay.config.values;

    return new Promise<string[]>((resolve, reject) => {
      new glob.Glob(
        '**/*',
        {
          cwd: config.source,
          nodir: true,
          ignore: [
            path.relative(config.source, config.partialsDir) + '/**/*',
            path.relative(config.source, config.postsDir) + '/**/*',
            path.relative(config.source, config.layoutsDir) + '/**/*',
            ...config.exclude
          ]
        },
        function (err: any, matches: string[]) {
          if (err) reject(err);

          resolve(matches);
        }
      );
    });
  }

  async parseOtherFile(file: string): Promise<any> {
    // let info: FileInfo = await this.hay.engine.extractInfo(file);
    // return this.hay.engine.parse(info);
    const config: ConfigValues =  this.hay.config.values;
    const fileSystem: HayFileSystem = this.hay.fileSystem;

    let mdExtensions: string[] = config.markdownExtensions;

    let info: FileInfo = {
      fileName: file,
      output: {
        directory: path.dirname(file),
        fileName: path.basename(file)
      },
      shortName: this.hay.fileSystem.removeExtension(file),
      fileExt: this.hay.fileSystem.getFileExtension(file)
    };

    let extensions: string[] = [
      ...config.layoutExtensions,
      ...config.markdownExtensions,
      ...config.partialExtensions
    ];

    if (extensions.includes(<string>info.fileExt)) {
      let baseName: string = path.basename(file, path.extname(file));
      let contents: string = await this.hay.fileSystem.readFile(path.resolve(config.source, file));

      let parsedHeader: FileParsed = await this.hay.engine.parseFile(contents, file);

      info.contents = parsedHeader.contents;
      info.options = parsedHeader.options;

      if (baseName !== 'index' && parsedHeader.options.permalink) {
        info.output.directory = parsedHeader.options.permalink;
        info.output.fileName = 'index.html';
      }

      let parsed: any = await this.hay.engine.compileTemplate(info);
      let output: string = await parsed.render(info);

      const destinationFolder: string = path.resolve(config.destination, info.output.directory);

      await fileSystem.mkDir(destinationFolder);
      await fileSystem.writeFile(
        path.resolve(destinationFolder, info.output.fileName),
        output
      );

      this.progressBar.tick(`compiled ${file}`);
    } else {
      await fileSystem.copy(
        path.resolve(config.source, file),
        path.resolve(config.destination, info.output.directory, info.output.fileName)
      );

      this.progressBar.tick(`copied ${file}`);
    }
  }

  async removeFile(file: File): Promise<any> {
    let shortName: string = path.basename(file.fileName);
  }

  async run(): Promise<any> {
    let files: string[] = await this.loadOtherFiles();

    this.progressBar.setLength(files.length - 1);
    this.progressBar.setCategory(`copy files`);
    this.progressBar.start();

    return Promise.all(files.map(async (file: string) => await this.parseOtherFile(file)));
  }

  public finish() {
    this.hay.reporter.finish(`<green>✓</green>  copied files`);
  }
}
