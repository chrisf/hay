// @flow
import { Config } from './config';
import { FileSystem } from './file-system';
import { Reporter } from './reporter';
import * as commander from 'commander';
import * as express from 'express';

import invariant from './invariant';
import { HayCommand, HayCommandInstance } from './cli';

import {
  EngineConstructor,
  TemplateEngine,
  ParserConstructor,
  TemplateParser
} from './template';

const engineStore: Map<string, EngineConstructor> = new Map<string, EngineConstructor>();
const parserStore: Map<string, ParserConstructor> = new Map<string, ParserConstructor>();

export class Hay {
  public config: Config;
  public engine: TemplateEngine;
  public fileSystem: FileSystem = new FileSystem();
  public parsers: TemplateParser[] = [];
  public reporter: Reporter;
  public server: any;
  public startTime: number;

  constructor(public program: commander.ICommand) {
    this.config = new Config();
    this.reporter = new Reporter({ suppressLevel: this.config.values.suppressLevel });

    this.config.setReporter(this.reporter);
  }

  static registerTemplateEngine<T>(name: string, engine: EngineConstructor) {
    engineStore.set(name, engine);
  }

  static registerTemplateParser(name: string, parser: ParserConstructor) {
    parserStore.set(name, parser);
  }

  public async run(command: HayCommand, startTime: number) {
    this.setTemplateEngine(this.config.values.engine);
    this.setTemplateParsers(this.config.values.parsers);

    this.startTime = startTime;
    this.config.resolvePaths();
    this.config.logInfo(this.reporter.log);

    let commandInstance: HayCommandInstance = new command(this);

    if ((<any>this.program).watch && commandInstance.watch)  {
      return await commandInstance.watch();
    }
    return await commandInstance.run();
  }

  public setTemplateEngine(engine: string) {
    invariant(
      engineStore.has(engine),
      `cannot find template engine ${engine}`
    );

    let engineConstructor: EngineConstructor = <any> engineStore.get(engine);

    this.engine = new engineConstructor(this);
  }

  public setTemplateParsers(parsers: string[]) {
    parsers.forEach((parser: string) => {
      invariant(
        parserStore.has(parser),
        `cannot find template parser ${parser}`
      );

      let parserConstructor: ParserConstructor = <any> parserStore.get(parser);

      this.parsers.push(new parserConstructor(this));
    });
  }
}
