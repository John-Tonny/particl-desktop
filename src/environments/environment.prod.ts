declare const require: any;

export const environment = {
  production: true,
  version: require('../../package.json').version,
  releasesUrl: 'https://api.github.com/repos/vpub/vpub-desktop/releases/latest',
  envName: 'prod',
  marketVersion: require('../../node_modules/vpub-marketplace/package.json').version,
  vpubHost: 'localhost',
  vpubPort: 51955,
  marketHost: 'localhost',
  marketPort: 3000,
  isTesting: false
};
