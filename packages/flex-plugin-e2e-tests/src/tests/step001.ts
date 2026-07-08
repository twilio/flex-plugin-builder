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
  // Run the link-packages.js script directly to avoid workspace context issues
  const linkPackagesScript = join(environment.cwd, 'link-packages.js');
  await spawn('node', [linkPackagesScript], { cwd: environment.cwd });
};
testSuite.description = 'Installing Twilio CLI and Plugins CLI';

export default testSuite;
