import { BaleCommand } from './bale';
import { ServeCommand } from './serve';

let commands: { [x: string]: any } = {
  bale: BaleCommand,
  serve: ServeCommand
};

export { commands };

// aliases
export const aliases: { [x: string]: string } = {
  'bail': 'bale', // I'm pretty sure it's spelt bale but
  'build': 'bale', // for serious developers who don't like a good play on words
};
