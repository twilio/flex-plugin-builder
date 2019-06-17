import * as path from 'path';
import { readPackage } from './fs';

const packageJson = readPackage();
const packageName = packageJson.name;
const buildDir = path.join(process.cwd(), 'build');
const assetBaseUrl = `/plugins/${packageName}/%PLUGIN_VERSION%`;

export default {
  buildDir: path.join(process.cwd(), 'build'),
  packageName,
  version: packageJson.version,
  localBundlePath: `${path.join(buildDir, packageName)}.js`,
  localSourceMapPath: `${path.join(buildDir, packageName)}.js.map`,
  appConfig: path.join(process.cwd(), 'public', 'appConfig.js'),
  assetBaseUrlTemplate: assetBaseUrl,
};
