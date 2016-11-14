// @flow
import commander from 'commander';

import * as commands from './commands';
import { Console } from './console';

const pkgInfo = require('../../package.json');

type HayCommand = {
  configure?: Function,
  run: () => Promise<void>
};

let [node, hay, name, ...endArgs] = process.argv;

let dividerIndex = endArgs.indexOf('--');
let args = endArgs.splice(0, dividerIndex === -1 ? endArgs.length : dividerIndex);

if (dividerIndex > -1) {
  endArgs.shift();
}

commander.version(pkgInfo.version);
commander.usage('[command] [flags]');

let commandName = '';

let helpCommands = ['help', '--help', '-h'];
if (helpCommands.includes(name)) {
  name = 'help';

  if (args.length) {
    commander.on('--help', () => {
      console.log(`hello ${name}`);
    });
  } else {
    commander.on('--help', () => {
      console.log(`hi`);
    });
  }

  name = args.shift();
  args.push('--help');
}

commandName = commands.aliases[name] || name || 'bale';

let command: HayCommand;
commands[commandName] && (command = commands[commandName]);
(command && command.configure) && command.configure(commander);

commander.parse([node, hay, commandName].concat(args));
commander.args = commander.args.concat(endArgs);

let config = {};

let reporter = new Console();

if (!command) {
  command = {
    run: () => Promise.reject(reporter.error(`Command ${commandName} not found`))
  };
}

if (commandName === 'help' || args.includes('--help') || args.includes('-h')) {
  commander.parse([node, hay, commandName].concat(args));
  commander.help();
  process.exit(1);
}

if (command && commandName !== name) {
  reporter.log(`<dim>Using ${commandName} (alias ${name} => ${commandName})</dim>`);
}

reporter.log(`<bold>${pkgInfo.name} ${commandName} v${pkgInfo.version}</bold>`);

command
  .run(config, reporter)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
