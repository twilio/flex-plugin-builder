#!/usr/bin/env node

import { logger } from 'flex-dev-utils';
import { checkForUpdate } from 'flex-dev-utils/dist/updateNotifier';

import spawn from './utils/spawn';

checkForUpdate();

const scripts = [
  'release',
  'start',
  'build',
  'test',
  'list',
  'clear',
];

const args = process.argv.slice(2);
const scriptIndex = args.findIndex((x) => scripts.includes(x));
const script = scriptIndex !== -1 && args[scriptIndex];
if (!script) {
  const options = logger.colors.blue(scripts.join(', '));
  logger.error(`Unknown script '${script}'; please choose from one of: ${options}.`);
  process.exit(1);
}

const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];
const scriptPath = require.resolve(`./scripts/${script}`);
const scriptArgs = args.slice(scriptIndex + 1);
const processArgs = nodeArgs.concat(scriptPath).concat(scriptArgs);

// Run the script and then exit
process.exit(spawn(processArgs));
