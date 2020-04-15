import {
  checkFilesExist,
  PackageJson,
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
let pkgName = '';
let pkgVersion = '';
// This file can be required in locations that don't have package.json
try {
  const pkg: PackageJson = readPackageJson();
  pkgName = pkg.name;
  pkgVersion = pkg.version;
} catch (e) {
  // no-op
}

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
    name: pkgName,
    version: pkgVersion,
    pkgPath: resolveCwd('package.json'),
    tsConfigPath,
    isTSProject: () => checkFilesExist(tsConfigPath),

    // build/*
    buildDir,
    bundlePath: resolveRelative(buildDir, pkgName, '.js'),
    sourceMapPath: resolveRelative(buildDir, pkgName, '.js.map'),

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
  assetBaseUrlTemplate: `/plugins/${pkgName}/%PLUGIN_VERSION%`,
  extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
};
