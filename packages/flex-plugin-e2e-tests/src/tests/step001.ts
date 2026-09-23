/* eslint-disable import/no-unused-modules */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { TestSuite, TestParams, twilioCliDataDir } from '../core';
import { spawn } from '../utils';

/*
 * `twilio plugins:install` installs plugins with yarn into the CLI data directory, resolving
 * against that directory's package.json - the repo's npm overrides do not apply there.
 * The published plugin-flex pulls ejs@3.x (via @twilio/cli-core -> @oclif/core@1), which
 * Artifactory curation blocks, so pin it to the allowed 6.x through yarn resolutions.
 * ejs@6 keeps the CommonJS `render` API @oclif/core uses.
 */
const pluginResolutions = {
  ejs: '^6.0.1',
};

const seedPluginsPackageJson = (): void => {
  const pkgPath = join(twilioCliDataDir, 'package.json');
  mkdirSync(twilioCliDataDir, { recursive: true });

  // Same initial shape @oclif/plugin-plugins creates; it preserves extra fields on save
  const pkg = existsSync(pkgPath)
    ? JSON.parse(readFileSync(pkgPath, 'utf8'))
    : { private: true, oclif: { schema: 1, plugins: [] }, dependencies: {} };
  pkg.resolutions = { ...pkg.resolutions, ...pluginResolutions };

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
};

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async ({ environment, scenario }: TestParams): Promise<void> => {
  const cliInstallArgs = ['install', '-g', 'twilio-cli'];

  if (!environment.ignorePrefix) {
    cliInstallArgs.push(`--prefix=${environment.homeDir}`);
  }

  await spawn('npm', cliInstallArgs);

  seedPluginsPackageJson();
  await spawn('twilio', ['plugins:install', `@twilio-labs/plugin-flex@${scenario.packageVersion}`]);
};
testSuite.description = 'Installing Twilio CLI and Plugins CLI';

export default testSuite;
