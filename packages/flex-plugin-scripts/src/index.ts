#!/usr/bin/env node

import { readdirSync } from 'fs';
import { join, dirname } from 'path';

import { env, exit, logger } from '@twilio/flex-dev-utils';
import { spawn } from '@twilio/flex-dev-utils/dist/spawn';
import { checkForUpdate } from '@twilio/flex-dev-utils/dist/updateNotifier';
import { getPaths, getCwd, addCWDNodeModule } from '@twilio/flex-dev-utils/dist/fs';
// eslint-disable-next-line import/no-unused-modules
export { PluginsConfig, PLUGIN_INPUT_PARSER_REGEX } from 'flex-plugin-webpack';

checkForUpdate();

const spawnScript = async (...argv: string[]): Promise<void> => {
  // Directory of this file
  const dir = dirname(__filename);

  /*
   * Get all the scripts inside /scripts directory
   * `run.js` is an exception, so filter that one out
   */
  const files = readdirSync(join(dir, 'scripts'));
  let scripts = files
    .filter((f) => {
      const ext = f.split('.').pop();

      return ext === 'js' || ext === 'ts';
    })
    .map((f) => f.split('.')[0])
    .filter((f) => f !== 'run');
  scripts = [...new Set(scripts)];

  const scriptIndex = argv.findIndex((x) => scripts.includes(x));
  const script = scriptIndex !== -1 && argv[scriptIndex];

  if (!script) {
    const options = logger.colors.blue(scripts.join(', '));
    logger.error(`Unknown script '${script}'; please choose from one of: ${options}.`);
    exit(1);
    return;
  }

  const nodeArgs = scriptIndex > 0 ? argv.slice(0, scriptIndex) : [];
  const scriptPath = require.resolve(`./scripts/${script}`);
  const scriptArgs = argv.slice(scriptIndex + 1);
  const processArgs = nodeArgs.concat(scriptPath).concat(scriptArgs);

  // Temp disallow version while we figure this out
  if (script !== 'test') {
    processArgs.push('--disallow-versioning');
  }

  addCWDNodeModule(...processArgs);

  // Backwards Compatibility 'npm run start'
  if (getCwd().includes('plugin-') && !processArgs.includes(getPaths().app.name)) {
    processArgs.push('--name');
    processArgs.push(getPaths().app.name);
  }

  processArgs.push('--run-script');
  const { exitCode } = await spawn('node', processArgs);
  exit(exitCode, argv);
};

/**
 * Sets the environment variables from the argv command line
 * @param argv
 */
export const setEnvironment = (...argv: string[]): void => {
  if (argv.includes('--quiet')) {
    env.setQuiet();
  }

  if (argv.includes('--persist-terminal')) {
    env.persistTerminal();
  }
};

export default spawnScript;
