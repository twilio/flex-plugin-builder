import { logger } from 'flex-dev-utils';
import { join } from 'path';
import { readPackageJson } from 'flex-dev-utils/dist/fs';

const packageJson = readPackageJson();
const packageName = packageJson.name;
const buildDir = join(process.cwd(), 'build');
const assetBaseUrl = `/plugins/${packageName}/%PLUGIN_VERSION%`;

if (packageName.substr(0, 6) !== 'plugin') {
  logger.error('Package name is \'%s\', but it must start with \'plugin\'.', packageName);
  process.exit(1);
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
