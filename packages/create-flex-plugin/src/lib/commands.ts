import { findUp, resolveCwd } from '@twilio/flex-dev-utils/dist/fs';
import { spawn } from '@twilio/flex-dev-utils/dist/spawn';
import { camelCase, upperFirst } from '@twilio/flex-dev-utils/dist/lodash';
import { packages } from '@twilio/flex-dev-utils';

import * as github from '../utils/github';
import { FlexPluginArguments } from './create-flex-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
const pkg = require(findUp(__filename, 'package.json'));

/**
 * Install dependencies
 *
 * @param config {FlexPluginArguments} the plugin argument
 * @return {string} the stdout of the execution
 */
export const installDependencies = async (config: FlexPluginArguments): Promise<string> => {
  const shellCmd = config.yarn ? 'yarn' : 'npm';
  const args = ['install'];
  const options = {
    cwd: config.targetDirectory,
    shell: process.env.SHELL,
  };

  const { stdout, exitCode, stderr } = await spawn(shellCmd, args, options);

  if (exitCode === 1) {
    throw new Error(stderr);
  }

  return stdout;
};

/**
 * Appends className to the configuration
 *
 * @param config {FlexPluginArguments}  the plugin configuration
 * @return {FlexPluginArguments} the updated configuration
 */
export const setupConfiguration = async (config: FlexPluginArguments): Promise<FlexPluginArguments> => {
  const name = config.name || '';

  config.pluginClassName = `${upperFirst(camelCase(name)).replace('Plugin', '')}Plugin`;
  config.pluginNamespace = name.toLowerCase().replace('plugin-', '');
  config.runtimeUrl = config.runtimeUrl || 'http://localhost:3000';
  config.targetDirectory = resolveCwd(name);
  config.flexSdkVersion = pkg.devDependencies['@twilio/flex-ui'];
  config.pluginScriptsVersion = pkg.devDependencies['@twilio/flex-plugin-scripts'];
  config.flexui2 = config.flexui2 || false;

  // Upgrade to latest Flex UI Version for 2.0 if selected
  if (config.flexui2) {
    config.flexSdkVersion = await packages.getLatestFlexUIVersion(2);
  }

  return config;
};

/**
 * Downloads content from GitHub
 *
 * @param url {string}                  the GitHub url
 * @param dir {string}                  the temp directory to save the downloaded file to
 */
export const downloadFromGitHub = async (url: string, dir: string): Promise<void> => {
  const info = await github.parseGitHubUrl(url);

  return github.downloadRepo(info, dir);
};
