import { env, logger } from 'flex-dev-utils';
import { checkFilesExist, findGlobs, resolveRelative } from 'flex-dev-utils/dist/fs';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import { existsSync, copyFileSync } from 'fs';
import semver from 'semver';

import {
  appConfigMissing,
  publicDirCopyFailed, typescriptNotInstalled,
  versionMismatch,
} from '../prints';
import expectedDependencyNotFound from '../prints/expectedDependencyNotFound';
import paths from '../utils/paths';
import run, { exit } from '../utils/run';

interface Package {
  dependencies: object;
}

const PackagesToVerify = [
  'react',
  'react-dom',
];

/**
 * Returns true if there are any .d.ts/.ts/.tsx files
 */
export const _hasTypescriptFiles = () => findGlobs('**/*.(ts|tsx)', '!**/node_modules', '!**/*.d.ts').length !== 0;

/**
 * Validates the TypeScript project
 * @private
 */
export const _validateTypescriptProject = () => {
  if (!_hasTypescriptFiles()) {
    return;
  }

  if (!resolveModulePath('typescript')) {
    typescriptNotInstalled();
    exit(1);

    return;
  }

  if (checkFilesExist(paths.tsConfigPath)) {
    return;
  }

  if (!env.isTerminalPersisted()) {
    logger.clearTerminal();
  }
  env.persistTerminal();
  logger.warning('No tsconfig.json was found, creating a default one.');
  copyFileSync(paths.scripts.tsConfigPath, paths.app.tsConfigPath);
};

/**
 * Checks appConfig exists
 *
 * @private
 */
export const _checkAppConfig = () => {
  if (!existsSync(paths.appConfig)) {
    appConfigMissing();

    return exit(1);
  }
};

/**
 * Syncs required files in public/ dir
 *
 * @param allowSkip whether to allow skip
 * @private
 */
export const _checkPublicDirSync = (allowSkip: boolean) => {
  try {
    copyFileSync(paths.scripts.indexHTMLPath, paths.indexHtmlPath);
  } catch (e) {
    publicDirCopyFailed(e, allowSkip);

    return exit(1);
  }
};

/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * allowSkip  whether to allow skip
 * @private
 */
/* istanbul ignore next */
export const _checkExternalDepsVersions = (allowSkip: boolean) => {
  const flexUIPkg = require(paths.flexUIPkgPath);

  PackagesToVerify.forEach((name) => _verifyPackageVersion(flexUIPkg, allowSkip, name));
};

/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * @param flexUIPkg   the flex-ui package.json
 * @param allowSkip   whether to allow skip
 * @param name        the package to check
 * @private
 */
export const _verifyPackageVersion = (flexUIPkg: Package, allowSkip: boolean, name: string) => {
  const expectedDependency = flexUIPkg.dependencies[name];
  if (!expectedDependency) {
    expectedDependencyNotFound(name);

    return exit(1);
  }

  // @ts-ignore
  const requiredVersion = semver.coerce(expectedDependency).version;

  const installedPath = resolveRelative(paths.nodeModulesDir, name, 'package.json');
  const installedVersion = require(installedPath).version;

  if (requiredVersion !== installedVersion) {
    versionMismatch(name, installedVersion, requiredVersion, allowSkip);

    if (!allowSkip) {
      return exit(1);
    }
  }
};

/**
 * Runs pre-start/build checks
 */
const checkStart = async () => {
  logger.debug('Checking Flex plugin project directory');

  _checkAppConfig();
  _checkPublicDirSync(env.skipPreflightCheck());
  _checkExternalDepsVersions(env.skipPreflightCheck());
  _validateTypescriptProject();
};

run(checkStart);

export default checkStart;
