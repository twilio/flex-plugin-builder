/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '../core';
import { spawn } from '../utils';
import { join } from 'path';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async ({ environment, scenario }: TestParams): Promise<void> => {
  const cliInstallArgs = ['install', '-g', 'twilio-cli'];

  if (!environment.ignorePrefix) {
    cliInstallArgs.push(`--prefix=${environment.homeDir}`);
  }

  await spawn('npm', cliInstallArgs);

  await spawn('twilio', ['plugins:install', `@twilio-labs/plugin-flex@${scenario.packageVersion}`]);

  // Link local packages to replace the installed CLI with local development version
  const rootDir = join(__dirname, '../../../../..');
  await spawn('npm', ['run', 'link-packages'], { cwd: rootDir });
};
testSuite.description = 'Installing Twilio CLI and Plugins CLI';

export default testSuite;
