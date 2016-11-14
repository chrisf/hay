/* @flow */
type BailSettings = {
  baseUrl: string,
  urls: {
    posts: string,
    layouts: string,
    partials: string
  },
  exclude: string[]
};

const baseSettings: BailSettings = {
  baseUrl: './site',
  urls: {
    posts: '_posts',
    layouts: '_layouts',
    partials: '_includes'
  },
  exclude: []
};

export class Settings {
  settings: BailSettings;

  constructor(settings: BailSettings) {
    this.settings = {...baseSettings, ...settings};
  }
}
