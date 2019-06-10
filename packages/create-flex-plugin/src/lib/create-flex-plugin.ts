import copy from 'copy-template-dir';
import fs from 'fs';
import ora from 'ora';
import tmp from 'tmp';
import { resolve, join } from 'path';
import { promisify } from 'util';
import { setupConfiguration, installDependencies, downloadFromGitHub } from './commands';
import { CLIArguments } from './cli';
import * as log from '../utils/logging';
import validate from '../utils/validators';

const copyDir = promisify(copy);
const moveFile = promisify(fs.rename);

const templatesRootDir = resolve(__dirname, '../../templates');
const templateCorePath = resolve(templatesRootDir, 'core');
const templateJsPath = resolve(templatesRootDir, 'js');
const templateTsPath = resolve(templatesRootDir, 'ts');

export interface FlexPluginArguments extends CLIArguments {
    targetDirectory: string;
    flexSdkVersion: string;
    flexPluginVersion: string;
    cracoConfigVersion: string;
    pluginJsonContent: string;
    pluginClassName: string;
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
        log.error(`Path ${config.targetDirectory} already exists. Please remove it and try again.`);
        process.exit(1);
    }

    // Setup the directories
    if (!await _scaffold(config)) {
        log.error('Failed to scaffold project');
        process.exit(1);
    }

    // Install NPM dependencies
    if (config.install) {
        if (!await _install(config)) {
            log.error('Failed to install dependencies. Please run `npm install` manually.');
            config.install = false;
        }
    }

    log.finalMessage(config);
};

/**
 * Runs the NPM Installation
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _install = async (config: FlexPluginArguments): Promise<boolean> => {
    const installSpinner = ora('Installing dependencies');
    try {
        installSpinner.start();

        await installDependencies(config);

        installSpinner.succeed();

        return true;
    } catch (err) {
        installSpinner.fail(err.message);
    }

    return false;
};

/**
 * Creates all the directories and copies the templates over
 *
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _scaffold = async (config: FlexPluginArguments): Promise<boolean> => {
    const templateSpinner = ora('Creating project directory');
    let dirObject;

    try {
        templateSpinner.start();

        // This copies the core such as public/ and craco config.
        await copyDir(
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
            dirObject = tmp.dirSync();
            await downloadFromGitHub(config, config.template, dirObject.name);
            srcPath = dirObject.name;
        }

        // This copies the src/ directory
        await copyDir(
          srcPath,
          config.targetDirectory,
          config,
        );

        // Rename plugins
        if (!dirObject) {
            const ext = config.typescript ? 'tsx' : 'js';

            await moveFile(
                join(config.targetDirectory, `src/DemoPlugin.${ext}`),
                join(config.targetDirectory, `src/${config.pluginClassName}.${ext}`),
            );
        }

        templateSpinner.succeed();

        return true;
    } catch (err) {
        templateSpinner.fail(err.message);
    } finally {
        if (dirObject) {
            dirObject.removeCallback();
        }
    }

    return false;
};

export default createFlexPlugin;
