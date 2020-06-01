import { logger, semver, FlexPluginError } from 'flex-dev-utils';
import { checkFilesExist } from 'flex-dev-utils/dist/fs';
import { existsSync, copyFileSync, readFileSync } from 'fs';
import { join } from 'path';

import {
  appConfigMissing,
  publicDirCopyFailed,
  unbundledReactMismatch,
  versionMismatch,
  cracoConfigMissing,
  expectedDependencyNotFound,
  loadPluginCountError,
} from '../prints';
import { getPackageVersion, nodeModulesPath } from '../utils/require';
import run from '../utils/run';

interface Package {
  version: string;
  dependencies: object;
}

const flexUIPkgPath = join(nodeModulesPath, '@twilio/flex-ui/package.json');
const srcIndexPath = join(process.cwd(), 'src', 'index');
const appConfigPath = join(process.cwd(), 'public', 'appConfig.js');
const cracoConfigPath = join(process.cwd(), 'craco.config.js');
const indexSourcePath = join(__dirname, '..', '..', 'dev_assets', 'index.html');
const indexTargetPath = join(process.cwd(), 'public', 'index.html');
const extensions = ['js', 'jsx', 'ts', 'tsx'];

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
export const _checkExternalDepsVersions = (allowSkip: boolean, allowReact: boolean) => {
  const flexUIPkg = require(flexUIPkgPath);

  PackagesToVerify.forEach((name) => _verifyPackageVersion(flexUIPkg, allowSkip, allowReact, name));
};

/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * @param flexUIPkg   the flex-ui package.json
 * @param allowSkip   whether to allow skip
 * @param allowReact  whether to allow unbundled react
 * @param name        the package to check
 * @private
 */
export const _verifyPackageVersion = (flexUIPkg: Package, allowSkip: boolean, allowReact: boolean, name: string) => {
  const expectedDependency = flexUIPkg.dependencies[name];
  const supportsUnbundled = semver.satisfies(flexUIPkg.version, '>=1.19.0');
  if (!expectedDependency) {
    expectedDependencyNotFound(name);

    return process.exit(1);
  }

  // @ts-ignore
  const requiredVersion = semver.coerce(expectedDependency).version;
  const installedVersion = getPackageVersion(name);

  if (requiredVersion !== installedVersion) {
    if (allowReact) {
      if (supportsUnbundled) {
        return;
      }

      unbundledReactMismatch(flexUIPkg.version, name, installedVersion, allowSkip);
    } else {
      versionMismatch(name, installedVersion, requiredVersion, allowSkip);
    }


    if (!allowSkip) {
      return process.exit(1);
    }
  }
};

/**
 * Returns the content of src/index
 * @private
 */
/* istanbul ignore next */
export const _readIndexPage = (): string => {
  const match = extensions
    .map(ext => `${srcIndexPath}.${ext}`)
    .find(file => checkFilesExist(file));
  if (match) {
    return readFileSync(match, 'utf8');
  }

  throw new FlexPluginError('No index file was found in your src directory');
}

/**
 * Checks how many plugins this single JS bundle is exporting
 * You can only have one plugin per JS bundle
 * @private
 */
export const _checkPluginCount = () => {
  const content = _readIndexPage();
  const match = content.match(/loadPlugin/g);
  if (!match || match.length === 0) {
    loadPluginCountError(0);

    return process.exit(1);
  }
  if (match.length > 1) {
    loadPluginCountError(match.length);

    return process.exit(1);
  }
};

/**
 * Runs pre-start/build checks
 */
const checkStart = async () => {
  logger.debug('Checking Flex plugin project directory');
  const allowSkip = process.env.SKIP_PREFLIGHT_CHECK === 'true';
  const allowReact = process.env.UNBUNDLED_REACT === 'true';

  _checkAppConfig();
  _checkCracoConfig();
  _checkPublicDirSync(allowSkip);
  _checkExternalDepsVersions(allowSkip, allowReact);
  _checkPluginCount();
};

run(checkStart);

export default checkStart;
