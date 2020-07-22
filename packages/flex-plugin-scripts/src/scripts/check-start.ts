import { env, logger, semver, FlexPluginError } from 'flex-dev-utils';
import { checkFilesExist, findGlobs, resolveRelative, mkdirpSync, getPaths, readPluginsJson, writeJSONFile } from 'flex-dev-utils/dist/fs';
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
import { confirm } from 'flex-dev-utils/dist/inquirer';

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

  if (checkFilesExist(getPaths().app.tsConfigPath)) {
    return;
  }

  logger.clearTerminal();
  env.persistTerminal();
  logger.warning('No tsconfig.json was found, creating a default one.');
  copyFileSync(getPaths().scripts.tsConfigPath, getPaths().app.tsConfigPath);
};

/**
 * Checks appConfig exists
 *
 * @private
 */
export const _checkAppConfig = () => {
  if (!existsSync(getPaths().app.appConfig)) {
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
    copyFileSync(getPaths().scripts.indexHTMLPath, getPaths().app.indexHtmlPath);
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
  const flexUIPkg = _require(getPaths().app.flexUIPkgPath);

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
  const installedPath = resolveRelative(getPaths().app.nodeModulesDir, name, 'package.json');
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
 * Touch ~/.twilio-cli/flex/plugins.json if it does not exist
 * Check if this plugin is in this config file. If not, add it.
 * @private
 */
export const _checkPluginConfigurationExists = async () => {
  if (!checkFilesExist(getPaths().cli.pluginsJsonPath)) {
      mkdirpSync(getPaths().cli.flexDir);
      writeJSONFile(getPaths().cli.pluginsJsonPath, {plugins: []});
  }

  const config = readPluginsJson();
  const plugin = config.plugins.find((p) => p.name === getPaths().app.name);

  if (!plugin) {
    config.plugins.push({name: getPaths().app.name, dir: getPaths().app.dir, port: 0});
    writeJSONFile(getPaths().cli.pluginsJsonPath, config);
    return;
  }

  if (plugin.dir === getPaths().app.dir) {
    return;
  }

  const answer = await confirm(`You already have a plugin called ${plugin.name} in the local Flex configuration file, but it is located at ${plugin.dir}. Do you want to update the directory path to ${getPaths().app.dir}?`, 'N');
  if (answer) {
    plugin.dir = getPaths().app.dir;
    writeJSONFile(getPaths().cli.pluginsJsonPath, config);
  }
};

/**
 * Runs pre-start/build checks
 */
const checkStart = async () => {
  logger.debug('Checking Flex plugin project directory');

  addCWDNodeModule();

  _checkAppConfig();
  _checkExternalDepsVersions(env.skipPreflightCheck(), env.allowUnbundledReact());
  _checkPluginCount();
  _validateTypescriptProject();
  await _checkPluginConfigurationExists();
};

run(checkStart);

export default checkStart;
