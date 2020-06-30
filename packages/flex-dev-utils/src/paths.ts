import {
  checkFilesExist,
  PackageJson,
  readAppPackageJson,
  resolveCwd,
  resolveRelative,
  getCwd,
  setCwd,
} from './fs';
import { homedir } from 'os';

// package.json information
let pkgName = '';
let pkgVersion = '';
// This file can be required in locations that don't have package.json

export const setWorkingDirectory = setCwd;

const paths = () => {
  const cwd = getCwd();
  const nodeModulesDir = resolveCwd('node_modules');
  const scriptsDir = resolveRelative(nodeModulesDir, 'flex-plugin-scripts');
  const devAssetsDir = resolveRelative(scriptsDir, 'dev_assets');
  const publicDir = resolveCwd('public');
  const buildDir = resolveCwd('build');
  const srcDir = resolveCwd('src');
  const flexUIDir = resolveRelative(nodeModulesDir, '@twilio/flex-ui');
  const homeDir = homedir();
  const cliDir = resolveRelative(homeDir, 'twilio-cli');
  const flexDir = resolveRelative(cliDir, 'flex');
  const tsConfigPath = resolveCwd('tsconfig.json');

  try {
    const pkg: PackageJson = readAppPackageJson();
    pkgName = pkg.name;
    pkgVersion = pkg.version;
  } catch (e) {
    // no-op
  }

  return {
    cwd,

    // flex-plugin-scripts paths
    scripts: {
      dir: scriptsDir,
      devAssetsDir,
      indexHTMLPath: resolveRelative(devAssetsDir, 'index.html'),
      tsConfigPath: resolveRelative(devAssetsDir, 'tsconfig.json'),
    },

    // twilio-cli/flex/plugins.json paths
    cli: {
      dir: cliDir,
      flexDir,
      pluginsJsonPath: resolveRelative(flexDir, 'plugins.json'),
    },

    // plugin-app (the customer app)
    app: {
      dir: cwd,
      name: pkgName,
      version: pkgVersion,
      pkgPath: resolveCwd('package.json'),
      jestConfigPath: resolveCwd('jest.config.js'),
      webpackConfigPath: resolveCwd('webpack.config.js'),
      devServerConfigPath: resolveCwd('webpack.dev.js'),
      tsConfigPath,
      isTSProject: () => checkFilesExist(tsConfigPath),
      setupTestsPaths: [
        resolveCwd('setupTests.js'),
        resolveRelative(srcDir, 'setupTests.js'),
      ],

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
}

export default paths;