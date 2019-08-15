import { progress } from 'flex-dev-utils/dist/ora';
import { logger } from 'flex-dev-utils';
import { copyTemplateDir, tmpDirSync, TmpDirResult } from 'flex-dev-utils/dist/fs';
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
    cracoConfigVersion: string;
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
        logger.error(`Path ${config.targetDirectory} already exists. Please remove it and try again.`);
        process.exit(1);
    }

    // Setup the directories
    if (!await _scaffold(config)) {
        logger.error('Failed to scaffold project');
        process.exit(1);
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
        // This copies the core such as public/ and craco config.
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
            await downloadFromGitHub(config, config.template, dirObject.name);
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

    promise.finally(() => {
        if (dirObject) {
            dirObject.removeCallback();
        }
    });

    return promise;
};

export default createFlexPlugin;
