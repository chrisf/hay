export const name: string = 'bale';

export async function run(config, reporter): Promise<void> {
  return new Promise((resolve, reject) => {
    reporter.success('baled');
    resolve();
  });
}


export function configure(commander): void {
  commander.usage('bail [flags]');
  commander.option('--test', 'test');
}
