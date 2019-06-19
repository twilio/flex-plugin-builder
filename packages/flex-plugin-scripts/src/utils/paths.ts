import * as path from 'path';
import { readPackageJson } from 'flex-dev-utils/dist/fs';

const packageJson = readPackageJson();
const packageName = packageJson.name;
const buildDir = path.join(process.cwd(), 'build');
const assetBaseUrl = `/plugins/${packageName}/%PLUGIN_VERSION%`;

export default {
  buildDir,
  packageName,
  version: packageJson.version,
  localBundlePath: `${path.join(buildDir, packageName)}.js`,
  localSourceMapPath: `${path.join(buildDir, packageName)}.js.map`,
  appConfig: path.join(process.cwd(), 'public', 'appConfig.js'),
  assetBaseUrlTemplate: assetBaseUrl,
};
