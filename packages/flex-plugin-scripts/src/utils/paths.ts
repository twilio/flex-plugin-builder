import { fs, logger } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { join } from 'path';
import { readPackageJson } from 'flex-dev-utils/dist/fs';

const cwd = fs.realpathSync(process.cwd());
const resolveApp = (...relativePath: string[]) => join(cwd, ...relativePath);
const packageJson = readPackageJson();
const packageName = packageJson.name;
const buildDir = join(process.cwd(), 'build');
const assetBaseUrl = `/plugins/${packageName}/%PLUGIN_VERSION%`;

if (packageName.substr(0, 6) !== 'plugin') {
  throw new FlexPluginError(`Package name "${packageName}" does not start with "plugin".`);
}

export default {
  buildDir,
  packageName,
  indexHtmlPath: resolveApp('public/index.html'),
  devAssetsDir: resolveApp('node_modules/flex-plugin-scripts/dev_assets'),
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
  flexUIPkgPath: resolveApp('node_modules/@twilio/flex-ui/package.json'),
  appNodeModules: resolveApp('node_modules'),
  appEntryPath: resolveApp('src/index'),
  appSrcDir: resolveApp('src'),
  appBuildDir: resolveApp('build'),
  appPublicDir: resolveApp('public'),
  version: packageJson.version,
  localBundlePath: `${join(buildDir, packageName)}.js`,
  localSourceMapPath: `${join(buildDir, packageName)}.js.map`,
  appConfig: join(process.cwd(), 'public', 'appConfig.js'),
  assetBaseUrlTemplate: assetBaseUrl,
};
