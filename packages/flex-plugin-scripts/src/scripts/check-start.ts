import { existsSync, copyFileSync } from 'fs';
import semver from 'semver';
import { join } from 'path';

import {
  appConfigMissing,
  publicDirCopyFailed,
  versionMismatch,
} from '../prints';
import cracoConfigMissing from '../prints/cracoConfigMissing';
import expectedDependencyNotFound from '../prints/expectedDependencyNotFound';
import run from '../utils/run';

interface Package {
  dependencies: object;
}

const nodeModulesPath = join(process.cwd(), 'node_modules');
const flexUIPkgPath = join(nodeModulesPath, '@twilio/flex-ui/package.json');
const appConfigPath = join(process.cwd(), 'public', 'appConfig.js');
const cracoConfigPath = join(process.cwd(), 'craco.config.js');
const indexSourcePath = join(__dirname, '..', '..', 'dev_assets', 'index.html');
const indexTargetPath = join(process.cwd(), 'public', 'index.html');

const PackagesToVerify = [
  'react',
  'react-dom',
];

/**
 * Checks appConfig exists
 *
 * @private
 */
export const _checkAppConfig = () => {
  if (!existsSync(appConfigPath)) {
    appConfigMissing();

    return process.exit(1);
  }
};

/**
 * Checks that craco-config path exists
 * @private
 */
export const _checkCracoConfig = () => {
  if (!existsSync(cracoConfigPath)) {
    cracoConfigMissing();

    return process.exit(1);
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
    copyFileSync(indexSourcePath, indexTargetPath);
  } catch (e) {
    publicDirCopyFailed(e, allowSkip);

    return process.exit(1);
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
  const flexUIPkg = require(flexUIPkgPath);

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

    return process.exit(1);
  }

  // @ts-ignore
  const requiredVersion = semver.coerce(expectedDependency).version;

  const installedPath = join(nodeModulesPath, name, 'package.json');
  const installedVersion = require(installedPath).version;

  if (requiredVersion !== installedVersion) {
    versionMismatch(name, installedVersion, requiredVersion, allowSkip);

    if (!allowSkip) {
      return process.exit(1);
    }
  }
};

/**
 * Runs pre-start/build checks
 */
const checkStart = async () => {
  const allowSkip = process.env.SKIP_PREFLIGHT_CHECK === 'true';

  _checkAppConfig();
  _checkCracoConfig();
  _checkPublicDirSync(allowSkip);
  _checkExternalDepsVersions(allowSkip);
};

run(checkStart);

export default checkStart;
