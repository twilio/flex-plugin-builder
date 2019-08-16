import { findUp } from 'flex-dev-utils/dist/fs';
import { spawn } from 'flex-dev-utils';
import { camelCase, upperFirst } from 'flex-dev-utils/dist/lodash';
import { join } from 'path';

import * as github from '../utils/github';
import { FlexPluginArguments } from './create-flex-plugin';

// tslint:disable-next-line
const pkg = require(findUp(__filename, 'package.json'));

/**
 * Install dependencies
 *
 * @param config {FlexPluginArguments} the plugin argument
 * @return {string} the stdout of the execution
 */
export async function installDependencies(config: FlexPluginArguments) {
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
}

/**
 * Appends className to the configuration
 *
 * @param config {FlexPluginArguments}  the plugin configuration
 * @return {FlexPluginArguments} the updated configuration
 */
export const setupConfiguration = (config: FlexPluginArguments): FlexPluginArguments => {
    const name = config.name || '';

    config.pluginClassName = upperFirst(camelCase(name)).replace('Plugin', '') + 'Plugin';
    config.pluginNamespace = name.toLowerCase().replace('plugin-', '');
    config.runtimeUrl = config.runtimeUrl || 'http://localhost:8080';
    config.targetDirectory = join(process.cwd(), name);
    config.flexSdkVersion = pkg.devDependencies['@twilio/flex-ui'];
    config.flexPluginVersion = pkg.devDependencies['flex-plugin'];
    config.cracoConfigVersion = pkg.devDependencies['craco-config-flex-plugin'];
    config.pluginScriptsVersion = pkg.devDependencies['flex-plugin-scripts'];
    config.pluginJsonContent = JSON.stringify(_getPluginJsonContent(config), null, 2);

    return config;
};

/**
 * Downloads content from GitHub
 *
 * @param config {FlexPluginArguments}  the plugin configuration
 * @param url {string}                  the GitHub url
 * @param dir {string}                  the temp directory to save the downloaded file to
 */
export const downloadFromGitHub = async (config: FlexPluginArguments, url: string, dir: string) => {
    const info = github.parseGitHubUrl(url);
    return await github.downloadRepo(info, dir);
};


// tslint:disable
export const _getPluginJsonContent = (config: FlexPluginArguments) => {
    return [{
        "name": config.pluginClassName,
        "version": "0.0.0",
        "class": config.pluginClassName,
        "requires": [{
            "@twilio/flex-ui": config.flexSdkVersion
        }],
        "src": `http://localhost:3000/${config.name}.js`,
    }];
};
// tslint:enable
