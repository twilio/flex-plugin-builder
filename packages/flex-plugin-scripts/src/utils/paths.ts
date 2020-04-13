import {
  checkFilesExist,
  readPackageJson,
  resolveCwd,
  resolveRelative,
} from 'flex-dev-utils/dist/fs';

// All directories
const nodeModulesDir = resolveCwd('node_modules');
const publicDir = resolveCwd('public');
const buildDir = resolveCwd('build');
const srcDir = resolveCwd('src');
const flexUIDir = resolveRelative(nodeModulesDir, '@twilio/flex-ui');

// package.json information
const packageJson = readPackageJson();
const packageName = packageJson.name;

// Others
const tsConfigPath = resolveCwd('tsconfig.json');

export default {
  // build/ directory paths
  buildDir,
  bundlePath: resolveRelative(buildDir, packageName, '.js'),
  sourceMapPath: resolveRelative(buildDir, packageName, '.js.map'),

  // src/ directory paths
  srcDir,
  entryPath: resolveRelative(srcDir, 'index'),

  // node_modules/ directory paths
  nodeModulesDir,
  flexUIDir,
  flexUIPkgPath: resolveRelative(flexUIDir, 'package.json'),
  devAssetsDir: resolveRelative(nodeModulesDir, 'flex-plugin-scripts/dev_assets'),

  // public/ directory paths
  publicDir,
  indexHtmlPath: resolveRelative(publicDir, 'index.html'),
  appConfig: resolveRelative(publicDir, 'appConfig.js'),
  pluginsJsonPath: resolveRelative(publicDir, 'plugins.json'),

  // app
  packageName,
  tsConfigPath,
  version: packageJson.version,
  packageJsonPath: resolveCwd('package.json'),
  isTSProject: () => checkFilesExist(tsConfigPath),

  // others
  assetBaseUrlTemplate: `/plugins/${packageName}/%PLUGIN_VERSION%`,
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
};
