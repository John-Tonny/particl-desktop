declare const require: any;

export const environment = {
  production: false,
  releasesUrl: 'https://api.github.com/repos/vpub/vpub-desktop/releases/latest',
  version: require('../../package.json').version,
  envName: 'docker1',
  vpubHost: 'localhost',
  vpubPort: 52935,
  marketVersion: 'UNKNOWN',
  marketHost: 'localhost',
  marketPort: 3100,
  isTesting: false
};
