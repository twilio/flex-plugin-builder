import * as copy from 'copy-template-dir';
import { resolve, join } from 'path';
import { promisify } from 'util';
import ora from 'ora';
import * as fs from 'fs';
import * as log from '../utils/logging';
import { CLIArguments } from './cli';
import { setupConfiguration, installDependencies } from './commands';
import validate from '../utils/validators';

const templatePath = resolve(__dirname, '../../templates');
const copyDir = promisify(copy);
const moveFile = promisify(fs.rename);

export interface FlexPluginArguments extends CLIArguments {
  targetDirectory: string;
  flexSdkVersion: string;
  flexPluginVersion: string;
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

	// Setup the directories
	await _scaffold(config);

	// Install NPM dependencies
	if (config.install) {
		await _install(config);
	}

	log.finalMessage(config);
};

/**
 * Runs the NPM Installation
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _install = async (config: FlexPluginArguments) => {
	const installSpinner = ora('Installing dependencies');
	try {
		installSpinner.start();

		await installDependencies(config);

		installSpinner.succeed();
	} catch (err) {
		installSpinner.fail(err.message);
	}
};

/**
 * Creates all the directories and copies the templates over
 *
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export const _scaffold = async (config: FlexPluginArguments) => {
	const templateSpinner = ora('Creating project directory');
	try {
		templateSpinner.start();

		await copyDir(
			templatePath,
			config.targetDirectory,
			config
		);
		await moveFile(
			join(config.targetDirectory, 'src/DemoPlugin.js'),
			join(config.targetDirectory, `src/${config.pluginClassName}.js`)
		);

		templateSpinner.succeed();
	} catch (err) {
		templateSpinner.fail(err.message);
	}
};

export default createFlexPlugin;
