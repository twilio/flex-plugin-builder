import {
  checkFilesExist, PackageJson,
  readPackageJson,
  resolveCwd,
  resolveRelative,
} from './fs';

// All directories
const nodeModulesDir = resolveCwd('node_modules');
const scriptsDir = resolveRelative(nodeModulesDir, 'flex-plugin-scripts');
const devAssetsDir = resolveRelative(scriptsDir, 'dev_assets');
const publicDir = resolveCwd('public');
const buildDir = resolveCwd('build');
const srcDir = resolveCwd('src');
const flexUIDir = resolveRelative(nodeModulesDir, '@twilio/flex-ui');

// package.json information
const packageJson: PackageJson = readPackageJson();
const packageName = packageJson.name;

// Others
const tsConfigPath = resolveCwd('tsconfig.json');

export default {
  cwd: process.cwd(),

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
    name: packageName,
    version: packageJson.version,
    pkgPath: resolveCwd('package.json'),
    tsConfigPath,
    isTSProject: () => checkFilesExist(tsConfigPath),

    // build/*
    buildDir,
    bundlePath: resolveRelative(buildDir, packageName, '.js'),
    sourceMapPath: resolveRelative(buildDir, packageName, '.js.map'),

    // src/*
    srcDir,
    entryPath: resolveRelative(srcDir, 'index'),

    // node_modules/*,
    nodeModulesDir,
    flexUIDir,
    flexUIPkgPath: resolveRelative(flexUIDir, 'package.json'),

    // public/*
    publicDir,
    indexHtmlPath: resolveRelative(publicDir, 'index.html'),
    appConfig: resolveRelative(publicDir, 'appConfig.js'),
    pluginsJsonPath: resolveRelative(publicDir, 'plugins.json'),
    pluginsServicePath: resolveRelative(publicDir, 'pluginsService.js'),
  },

  // others
  assetBaseUrlTemplate: `/plugins/${packageName}/%PLUGIN_VERSION%`,
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
};
