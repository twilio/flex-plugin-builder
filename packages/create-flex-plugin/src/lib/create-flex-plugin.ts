import fs from 'fs';
import { resolve, join } from 'path';

import {
  logger,
  progress,
  FlexPluginError,
  singleLineString,
  Telemetry,
  TRACK_EVENT_NAME,
} from '@twilio/flex-dev-utils';
import { copyTemplateDir, checkPluginConfigurationExists } from '@twilio/flex-dev-utils/dist/fs';
import { dirSync as tmpDirSync, DirResult as TmpDirResult } from 'tmp';

import { setupConfiguration, installDependencies, downloadFromGitHub } from './commands';
import { CLIArguments } from './cli';
import finalMessage from '../prints/finalMessage';
import validate from '../utils/validators';

const templatesRootDir = resolve(__dirname, '../../templates');
const templateCorePath = resolve(templatesRootDir, 'core');
const templateJsPath = resolve(templatesRootDir, 'js');
const templateTsPath = resolve(templatesRootDir, 'ts');
const templateJs2Path = resolve(templatesRootDir, 'js2');
const templateTs2Path = resolve(templatesRootDir, 'ts2');

export interface FlexPluginArguments extends CLIArguments {
  name: string;
  targetDirectory: string;
  flexSdkVersion: string;
  pluginScriptsVersion: string;
  flexPluginVersion: string;
  pluginClassName: string;
  pluginNamespace: string;
  flexui2: boolean;
  flexui1: boolean;
}

/**
 * Runs the NPM Installation
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _install = async (config: FlexPluginArguments): Promise<boolean> => {
  return progress('Installing dependencies', async () => {
    await installDependencies(config);

    return true;
  });
};

/**
 * Creates all the directories and copies the templates over
 *
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _scaffold = async (config: FlexPluginArguments): Promise<boolean> => {
  let dirObject: TmpDirResult;

  const promise = progress('Creating project directory', async () => {
    // This copies the core such as public/
    await copyTemplateDir(templateCorePath, config.targetDirectory, config);

    // Get src directory from template URL if provided
    let srcPath = config.flexui1 ? templateJsPath : templateJs2Path;

    if (config.typescript) {
      srcPath = config.flexui1 ? templateTsPath : templateTs2Path;
    }
    if (config.template) {
      dirObject = tmpDirSync();
      await downloadFromGitHub(config.template, dirObject.name);
      srcPath = dirObject.name;
    }

    // This copies the src/ directory
    await copyTemplateDir(srcPath, config.targetDirectory, config);

    // Rename plugins
    if (!dirObject) {
      const ext = config.typescript ? 'tsx' : 'js';

      fs.renameSync(
        join(config.targetDirectory, `src/DemoPlugin.${ext}`),
        join(config.targetDirectory, `src/${config.pluginClassName}.${ext}`),
      );
    }

    return true;
  });

  const cleanUp = () => {
    if (dirObject) {
      dirObject.removeCallback();
    }
  };

  promise.then(cleanUp).catch(cleanUp);

  return promise;
};

/**
 * Keep track for the command using the {@link FlexPluginArguments}
 * @param timeTaken xtime for the command
 * @param config {FlexPluginArguments} the configuration
 */
export const track = (timeTaken: number, config: FlexPluginArguments): void => {
  const telemetry = new Telemetry();
  const accountSid: string = String(config.accountSid);
  const properties = {
    cliVersion: config.pluginScriptsVersion,
    command: 'create',
    xtime: Math.round(timeTaken),
    pluginName: config.name,
    pluginVersion: '0.0.0',
    flexUiVersion: config.flexSdkVersion,
    typescript: config.typescript,
  };
  telemetry.track(TRACK_EVENT_NAME, accountSid, properties);
};

/**
 * Creates a Flex Plugin from the {@link FlexPluginArguments}
 * @param config {FlexPluginArguments} the configuration
 */
export const createFlexPlugin = async (config: FlexPluginArguments): Promise<void> => {
  const start = performance.now();
  config = await validate(config);
  config = await setupConfiguration(config);

  // Check folder does not exist
  if (fs.existsSync(config.targetDirectory)) {
    throw new FlexPluginError(
      singleLineString(
        `Path ${logger.coloredStrings.link(config.targetDirectory)} already exists;`,
        'please remove it and try again.',
      ),
    );
  }

  // Setup the directories
  if (!(await _scaffold(config))) {
    throw new FlexPluginError('Failed to scaffold project');
  }

  // Add new plugin to .twilio-cli/flex/plugins.json
  await checkPluginConfigurationExists(config.name, config.targetDirectory);

  // Install NPM dependencies
  if (config.install && !(await _install(config))) {
    logger.error('Failed to install dependencies. Please run `npm install` manually.');
    config.install = false;
  }

  finalMessage(config);
  const end = performance.now();
  track(end - start, config);
};

export default createFlexPlugin;
