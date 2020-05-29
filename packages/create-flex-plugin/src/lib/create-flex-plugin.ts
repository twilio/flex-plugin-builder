import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { logger, progress } from 'flex-dev-utils';
import { copyTemplateDir, tmpDirSync, TmpDirResult } from 'flex-dev-utils/dist/fs';
import { singleLineString } from 'flex-dev-utils/dist/strings';
import fs from 'fs';
import { resolve, join } from 'path';

import { setupConfiguration, installDependencies, downloadFromGitHub } from './commands';
import { CLIArguments } from './cli';
import finalMessage from '../prints/finalMessage';
import validate from '../utils/validators';

const templatesRootDir = resolve(__dirname, '../../templates');
const templateCorePath = resolve(templatesRootDir, 'core');
const templateJsPath = resolve(templatesRootDir, 'js');
const templateTsPath = resolve(templatesRootDir, 'ts');

export interface FlexPluginArguments extends CLIArguments {
  targetDirectory: string;
  flexSdkVersion: string;
  flexPluginVersion: string;
  pluginScriptsVersion: string;
  pluginJsonContent: string;
  pluginClassName: string;
  pluginNamespace: string;
}

/**
 * Creates a Flex Plugin from the {@link FlexPluginArguments}
 * @param config {FlexPluginArguments} the configuration
 */
export const createFlexPlugin = async (config: FlexPluginArguments) => {
  config = await validate(config);
  config = setupConfiguration(config);

  // Check folder does not exist
  if (fs.existsSync(config.targetDirectory)) {
    throw new FlexPluginError(singleLineString(
      `Path ${logger.coloredStrings.link(config.targetDirectory)} already exists;`,
      'please remove it and try again.',
    ));
  }

  // Setup the directories
  if (!await _scaffold(config)) {
    throw new FlexPluginError('Failed to scaffold project');
  }

  // Install NPM dependencies
  if (config.install) {
    if (!await _install(config)) {
      logger.error('Failed to install dependencies. Please run `npm install` manually.');
      config.install = false;
    }
  }

  finalMessage(config);
};

/**
 * Runs the NPM Installation
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _install = async (config: FlexPluginArguments): Promise<boolean> => {
  return progress<boolean>('Installing dependencies', async () => {
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

  const promise = progress<boolean>('Creating project directory', async () => {
    // This copies the core such as public/
    await copyTemplateDir(
      templateCorePath,
      config.targetDirectory,
      config,
    );

    // Get src directory from template URL if provided
    let srcPath = templateJsPath;
    if (config.typescript) {
      srcPath = templateTsPath;
    }
    if (config.template) {
      dirObject = tmpDirSync();
      await downloadFromGitHub(config.template, dirObject.name);
      srcPath = dirObject.name;
    }

    // This copies the src/ directory
    await copyTemplateDir(
      srcPath,
      config.targetDirectory,
      config,
    );

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

  promise
    .then(cleanUp)
    .catch(cleanUp);

  return promise;
};

export default createFlexPlugin;
