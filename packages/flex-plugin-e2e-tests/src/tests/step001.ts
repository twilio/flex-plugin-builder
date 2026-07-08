/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '../core';
import { spawn } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async ({ environment, scenario }: TestParams): Promise<void> => {
  const cliInstallArgs = ['install', '-g', 'twilio-cli'];

  if (!environment.ignorePrefix) {
    cliInstallArgs.push(`--prefix=${environment.homeDir}`);
  }

  await spawn('npm', cliInstallArgs);

  await spawn('twilio', ['plugins:install', `@twilio-labs/plugin-flex@${scenario.packageVersion}`]);

  // Link local packages to replace the installed CLI with local development version
  // Use environment.cwd which points to the repo root where the E2E tests are run from
  await spawn('npm', ['run', 'link-packages'], { cwd: environment.cwd });
};
testSuite.description = 'Installing Twilio CLI and Plugins CLI';

export default testSuite;
