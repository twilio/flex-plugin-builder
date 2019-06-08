#!/usr/bin/env node

import spawn from '../utils/spawn';
import * as logger from '../utils/logger';

const scripts = [
  'start',
  'build',
  'test',
];

const args = process.argv.slice(2);
const scriptIndex = args.findIndex((x) => scripts.includes(x));
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
if (!script) {
  logger.error(`Unknown script ${script}`);
  process.exit(1);
}

const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];
const scriptPath = require.resolve(`../scripts/${script}`);
const scriptArgs = args.slice(scriptIndex + 1);
const processArgs = nodeArgs.concat(scriptPath).concat(scriptArgs);

// Run the script and then exit
process.exit(spawn(processArgs));
