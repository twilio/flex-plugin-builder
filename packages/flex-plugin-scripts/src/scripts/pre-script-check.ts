import { copyFileSync, readFileSync } from 'fs';
import { join } from 'path';

import { env, logger, semver, FlexPluginError, exit, versionSatisfiesRange } from '@twilio/flex-dev-utils';
import {
  checkFilesExist,
  findGlobs,
  resolveRelative,
  getPaths,
  getCwd,
  checkPluginConfigurationExists,
  addCWDNodeModule,
  resolveModulePath,
  _require,
  setCwd,
  getCliPaths,
  readPackageJson,
  checkAFileExists,
  isPluginDir,
  packageDependencyVersion,
  PackageJson,
} from '@twilio/flex-dev-utils/dist/fs';

import {
  unbundledReactMismatch,
  expectedDependencyNotFound,
  loadPluginCountError,
  typescriptNotInstalled,
} from '../prints';
import run from '../utils/run';
import { findFirstLocalPlugin, parseUserInputPlugins } from '../utils/parser';

const extensions = ['js', 'jsx', 'ts', 'tsx'];

const PackagesToVerify = ['react', 'react-dom'];

const packageJsonName = 'package.json';

export const FLAG_MULTI_PLUGINS = '--multi-plugins-pilot';

export const flags = [FLAG_MULTI_PLUGINS];

/**
 * Returns true if there are any .d.ts/.ts/.tsx files
 */
/* c8 ignore next */
export const _hasTypescriptFiles = (): boolean =>
  findGlobs('**/*.(ts|tsx)', '!**/node_modules', '!**/*.d.ts').length !== 0;

/**
 * Validates the TypeScript project
 * @private
 */
export const _validateTypescriptProject = (): void => {
  if (!_hasTypescriptFiles()) {
    return;
  }

  if (!resolveModulePath('typescript')) {
    typescriptNotInstalled();
    exit(1);

    return;
  }

  if (checkFilesExist(getPaths().app.tsConfigPath)) {
    return;
  }

  logger.clearTerminal();
  env.persistTerminal();
  logger.warning('No tsconfig.json was found, creating a default one.');
  copyFileSync(getPaths().scripts.tsConfigPath, getPaths().app.tsConfigPath);
};

/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * @param flexUIPkg   the flex-ui package.json
 * @param allowSkip   whether to allow skip
 * @param name        the package to check
 * @private
 */
export const _verifyPackageVersion = (flexUIPkg: PackageJson, allowSkip: boolean, name: string): void => {
  const expectedDependency = packageDependencyVersion(flexUIPkg, name);
  if (!expectedDependency) {
    expectedDependencyNotFound(name);

    exit(1);
    return;
  }

  // @ts-ignore
  const requiredVersion = semver.coerce(expectedDependency).version;
  const installedPath = resolveRelative(getPaths().app.nodeModulesDir, name, packageJsonName);
  const installedVersion = _require(installedPath).version;
  const supportsUnbundled = versionSatisfiesRange(flexUIPkg.version, '>=1.19.0');

  if (requiredVersion !== installedVersion) {
    if (supportsUnbundled) {
      return;
    }
    unbundledReactMismatch(flexUIPkg.version, name, installedVersion, allowSkip);

    if (!allowSkip) {
      exit(1);
    }
  }
};

/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * allowSkip  whether to allow skip
 * @private
 */
/* c8 ignore next */
export const _checkExternalDepsVersions = (allowSkip: boolean): void => {
  const flexUIPkg = _require(getPaths().app.flexUIPkgPath);

  PackagesToVerify.forEach((name) => _verifyPackageVersion(flexUIPkg, allowSkip, name));
};

/**
 * Returns the content of src/index
 * @private
 */
/* c8 ignore next */
export const _readIndexPage = (): string => {
  const srcIndexPath = join(getCwd(), 'src', 'index');
  const match = extensions.map((ext) => `${srcIndexPath}.${ext}`).find((file) => checkFilesExist(file));
  if (match) {
    return readFileSync(match, 'utf8');
  }

  throw new FlexPluginError('No index file was found in your src directory');
};

/**
 * Checks how many plugins this single JS bundle is exporting
 * You can only have one plugin per JS bundle
 * @private
 */
export const _checkPluginCount = (): void => {
  const content = _readIndexPage();
  const match = content.match(/\.loadPlugin\(/g);
  if (!match || match.length === 0) {
    loadPluginCountError(0);

    exit(1);
    return;
  }
  if (match.length > 1) {
    loadPluginCountError(match.length);

    exit(1);
  }
};

/**
 * Attempts to set the cwd of the plugin
 * @param args  the CLI args
 * @private
 */
export const _setPluginDir = (...args: string[]): void => {
  if (!checkFilesExist(getCliPaths().pluginsJsonPath)) {
    return;
  }

  const userInputPlugins = parseUserInputPlugins(false, ...args);
  const plugin = findFirstLocalPlugin(userInputPlugins);

  if (plugin && checkFilesExist(plugin.dir)) {
    setCwd(plugin.dir);
  }
};

/**
 * Compares the CLI and the plugin for flex-plugin-scripts
 * @private
 */
export const _comparePluginAndCLIVersions = (): void => {
  const cliPackageJson = readPackageJson(join(getCliPaths().dir, packageJsonName));
  const pluginPackageJson = readPackageJson(join(getCwd(), packageJsonName));
  const cliVersion = semver.coerce(packageDependencyVersion(cliPackageJson, '@twilio-labs/plugin-flex'));
  const pluginVersion = semver.coerce(packageDependencyVersion(pluginPackageJson, '@twilio/flex-plugin-scripts'));

  if (cliVersion && pluginVersion && cliVersion.version !== pluginVersion.version) {
    const earlierVersion = cliVersion.version < pluginVersion.version ? 'CLI' : '@twilio/flex-plugin-scripts';
    logger.warning(
      `The Flex Plugins CLI version installed is different from the version used by your plugin. The Plugins CLI version installed is ${cliVersion.version} and the version used by your plugin is ${pluginVersion.version}. Run the upgrade plugin command to use the installed version.`,
    );
  }
};

/**
 * Runs pre-start/build checks
 */
const preScriptCheck = async (...args: string[]): Promise<void> => {
  logger.debug('Checking Flex plugin project directory');

  addCWDNodeModule(...args);

  _setPluginDir(...args);

  const hasPackageJson = checkAFileExists(process.cwd(), packageJsonName);
  if (hasPackageJson) {
    const packageJson = readPackageJson(join(process.cwd(), packageJsonName));

    if (isPluginDir(packageJson)) {
      const pkgName = packageJson.name;
      if (!pkgName) {
        throw new FlexPluginError('No package name was found');
      }

      const resetPluginDirectory = await checkPluginConfigurationExists(
        pkgName,
        process.cwd(),
        args.includes(FLAG_MULTI_PLUGINS),
      );
      if (resetPluginDirectory) {
        _setPluginDir(...args);
      }
    }
  }

  _checkExternalDepsVersions(env.skipPreflightCheck());
  _checkPluginCount();
  _validateTypescriptProject();
  _comparePluginAndCLIVersions();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(preScriptCheck);

// eslint-disable-next-line import/no-unused-modules
export default preScriptCheck;
