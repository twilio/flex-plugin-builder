import { env, logger, semver, FlexPluginError } from 'flex-dev-utils';
import paths from 'flex-dev-utils/dist/paths';
import { checkFilesExist, findGlobs, resolveRelative } from 'flex-dev-utils/dist/fs';
import { addCWDNodeModule, resolveModulePath, _require } from 'flex-dev-utils/dist/require';
import { existsSync, copyFileSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  appConfigMissing,
  publicDirCopyFailed,
  unbundledReactMismatch,
  versionMismatch,
  expectedDependencyNotFound,
  loadPluginCountError,
  typescriptNotInstalled,
} from '../prints';
import run, { exit } from '../utils/run';

interface Package {
  version: string;
  dependencies: object;
}


const srcIndexPath = join(process.cwd(), 'src', 'index');
const extensions = ['js', 'jsx', 'ts', 'tsx'];

const PackagesToVerify = [
  'react',
  'react-dom',
];

/**
 * Returns true if there are any .d.ts/.ts/.tsx files
 */
/* istanbul ignore next */
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

  if (checkFilesExist(paths.app.tsConfigPath)) {
    return;
  }

  logger.clearTerminal();
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
  if (!existsSync(paths.app.appConfig)) {
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
    copyFileSync(paths.scripts.indexHTMLPath, paths.app.indexHtmlPath);
  } catch (e) {
    publicDirCopyFailed(e, allowSkip);

    return exit(1);
  }
};

/**
 * Checks the version of external libraries and exists if customer is using another version
 *
 * allowSkip  whether to allow skip
 * allowReact whether to allow reacts
 * @private
 */
/* istanbul ignore next */
export const _checkExternalDepsVersions = (allowSkip: boolean, allowReact: boolean) => {
  const flexUIPkg = _require(paths.app.flexUIPkgPath);

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

    return exit(1);
  }

  // @ts-ignore
  const requiredVersion = semver.coerce(expectedDependency).version;
  const installedPath = resolveRelative(paths.app.nodeModulesDir, name, 'package.json');
  const installedVersion = _require(installedPath).version;

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
      return exit(1);
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

  addCWDNodeModule();

  _checkAppConfig();
  _checkPublicDirSync(env.skipPreflightCheck());
  _checkExternalDepsVersions(env.skipPreflightCheck(), env.allowUnbundledReact());
  _checkPluginCount();
  _validateTypescriptProject();
};

run(checkStart);

export default checkStart;
