/* eslint-disable import/no-unused-modules */
import { join } from 'path';

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

  /*
   * Link local packages to replace the installed CLI with local development version
   * Go up two directories from e2e-tests package to reach repo root
   */
  const repoRoot = join(environment.cwd, '..', '..');
  const linkPackagesScript = join(repoRoot, 'link-packages.js');
  await spawn('node', [linkPackagesScript], { cwd: repoRoot });
};
testSuite.description = 'Installing Twilio CLI and Plugins CLI';

export default testSuite;
