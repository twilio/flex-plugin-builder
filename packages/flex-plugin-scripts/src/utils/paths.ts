import {
  checkFilesExist,
  readPackageJson,
  resolveCwd,
  resolveRelative,
} from 'flex-dev-utils/dist/fs';

// All directories
const nodeModulesDir = resolveCwd('node_modules');
const scriptsDir = resolveRelative(nodeModulesDir, 'flex-plugin-scripts');
const devAssetsDir = resolveRelative(scriptsDir, 'dev_assets');
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
  // flex-plugin-scripts paths
  scripts: {
    dir: scriptsDir,
    devAssetsDir,
    indexHTMLPath: resolveRelative(devAssetsDir, 'index.html'),
    tsConfigPath: resolveRelative(devAssetsDir, 'tsconfig.json'),
  },

  // plugin-app (the customer app)
  app: {
    dir: process.cwd(),
    tsConfigPath,
    isTSProject: () => checkFilesExist(tsConfigPath),
  },

  // TODO: Move all of these into above fields

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

  // public/ directory paths
  publicDir,
  indexHtmlPath: resolveRelative(publicDir, 'index.html'),
  appConfig: resolveRelative(publicDir, 'appConfig.js'),
  pluginsJsonPath: resolveRelative(publicDir, 'plugins.json'),

  // app
  packageName,
  version: packageJson.version,
  packageJsonPath: resolveCwd('package.json'),

  // others
  assetBaseUrlTemplate: `/plugins/${packageName}/%PLUGIN_VERSION%`,
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
};
