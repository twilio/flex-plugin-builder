/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '../core';
import { spawn, logResult } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async ({ environment, scenario }: TestParams): Promise<void> => {
  const cliInstallArgs = ['install', '-g', 'twilio-cli'];

  if (!environment.ignorePrefix) {
    cliInstallArgs.push(`--prefix=${environment.homeDir}`);
  }

  const twilioCliResult = await spawn('npm', cliInstallArgs);
  logResult(twilioCliResult);

  const pluginsCliResult = await spawn('twilio', [
    'plugins:install',
    `@twilio-labs/plugin-flex@${scenario.packageVersion}`,
  ]);
  logResult(pluginsCliResult);
};
testSuite.description = 'Installing Twilio CLI and Plugins CLI';

export default testSuite;
