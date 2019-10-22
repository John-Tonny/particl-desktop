declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  releasesUrl: 'https://api.github.com/repos/vircle/vircle-desktop/releases/latest',
  envName: 'prod',
  marketVersion: require('../../node_modules/vircle-marketplace/package.json').version,
  vpubHost: 'localhost',
  vpubPort: 19092,
  marketHost: 'localhost',
  marketPort: 3000,
  isTesting: false
};
