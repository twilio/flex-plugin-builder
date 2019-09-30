import { logger } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { join } from 'path';
import { readPackageJson } from 'flex-dev-utils/dist/fs';

const packageJson = readPackageJson();
const packageName = packageJson.name;
const buildDir = join(process.cwd(), 'build');
const assetBaseUrl = `/plugins/${packageName}/%PLUGIN_VERSION%`;

if (packageName.substr(0, 6) !== 'plugin') {
  throw new FlexPluginError(`Package name "${packageName}" does not start with "plugin"`);
}

export default {
  buildDir,
  packageName,
  version: packageJson.version,
  localBundlePath: `${join(buildDir, packageName)}.js`,
  localSourceMapPath: `${join(buildDir, packageName)}.js.map`,
  appConfig: join(process.cwd(), 'public', 'appConfig.js'),
  assetBaseUrlTemplate: assetBaseUrl,
};
