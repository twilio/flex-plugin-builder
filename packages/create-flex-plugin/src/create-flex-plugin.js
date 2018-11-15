import execa from 'execa';
import copy from 'copy-template-dir';
import inquirer from 'inquirer';
import { camelCase, upperFirst } from 'lodash';
import path from 'path';
import { promisify } from 'util';
import ora from 'ora';
import fs from 'fs';
import pkg from '../package.json';
import * as log from './logging';

const templatePath = path.resolve(__dirname, '../templates');

const copyDir = promisify(copy);
const moveFile = promisify(fs.rename);

function getPluginJsonContent(config) {
  const plugins = [
    {
      "name": config.pluginClassName,
      "version": "0.0.0",
      "class": config.pluginClassName,
      "requires": [
        {
          "@twilio/flex-ui": config.flexSdkVersion
        }
      ],
      "src": `http://localhost:8080/${config.pluginFileName}.js`
    }
  ]
  if (config.adminPlugin) {
    plugins.push({
      "name": "Admin Plugin",
      "version": "0.7.2",
      "src": "https:\/\/flexperience.twil.io\/assets\/flex.admin.plugin-0.7.2.js"
    });
  }

  return plugins;
}

function parsePluginName(pluginName, config) {
  config.pluginFileName = pluginName;
  config.pluginClassName =
    upperFirst(camelCase(pluginName)).replace('Plugin', '') + 'Plugin';
  return config;
}

function isValidPluginName(name) {
  return name.startsWith('plugin-');
}

async function promptForAccountSid() {
  const response = await inquirer.prompt([
    {
      type: 'input',
      name: 'accountSid',
      message: 'Twilio Flex Account SID',
      validate: x => x.startsWith('AC'),
    },
  ]);
  return response.accountSid;
}

async function promptForAdminPlugin() {
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'adminPlugin',
      message: 'Do you want to include the Admin Plugin',
      default: true
    }
  ])
  return response.adminPlugin;
}

async function installDependencies(config) {
  const command = config.yarn ? 'yarn' : 'npm';
  const args = ['install'];
  const options = { cwd: config.targetDirectory, shell: process.env.SHELL };
  const { stdout } = await execa(command, args, options);
  return stdout;
}

export default async function createFlexPlugin(config) {
  const pluginName = config.name || '';

  if (!isValidPluginName(pluginName)) {
    log.error('Invalid plugin name. Names need to start with plugin-');
    return process.exit(1);
  }

  config = parsePluginName(pluginName, config);

  if (!config.accountSid) {
    config.accountSid = await promptForAccountSid();
  }

  if (typeof config.adminPlugin === 'undefined') {
    config.adminPlugin = await promptForAdminPlugin();
  }

  config.runtimeUrl = config.runtimeUrl || 'http://localhost:8080';

  config.targetDirectory = path.join(process.cwd(), config.pluginFileName);
  config.flexSdkVersion = pkg.devDependencies['@twilio/flex-ui'];
  config.flexPluginVersion = pkg.devDependencies['flex-plugin'].replace('^', '');
  config.pluginJsonContent = JSON.stringify(getPluginJsonContent(config), null, 2);

  const templateSpinner = ora('Creating project directory');
  try {
    templateSpinner.start();
    const createdFiles = await copyDir(
      templatePath,
      config.targetDirectory,
      config
    );
    await moveFile(
      path.join(config.targetDirectory, 'src/DemoPlugin.js'),
      path.join(config.targetDirectory, `src/${config.pluginClassName}.js`)
    );
    templateSpinner.succeed();
  } catch (err) {
    templateSpinner.fail(err.message);
  }

  if (config.install) {
    const installSpinner = ora('Installing dependencies');
    try {
      installSpinner.start();
      await installDependencies(config);
      installSpinner.succeed();
    } catch (err) {
      installSpinner.fail(err.message);
    }
  }

  log.finalMessage(config);
}
