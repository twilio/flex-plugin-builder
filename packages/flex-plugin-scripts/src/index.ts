#!/usr/bin/env node

import { logger } from 'flex-dev-utils';
import { checkForUpdate } from 'flex-dev-utils/dist/updateNotifier';
import { readdirSync, existsSync } from 'fs';
import { render as markedRender } from 'flex-dev-utils/dist/marked';
import { join, dirname } from 'path';
import spawn from './utils/spawn';

checkForUpdate();

// Get all the scripts inside /scripts directory
// `run.js` is an exception to filter that one out
const dir = dirname(__filename);
const files = readdirSync(join(dir, 'scripts'));
const scripts = files
  .filter((f) => f.split('.').pop() === 'js')
  .map((f) => f.split('.')[0])
  .filter((f) => f !== 'run');

const argv = process.argv.slice(2);
const scriptIndex = argv.findIndex((x) => scripts.includes(x));
const script = scriptIndex !== -1 && argv[scriptIndex];
if (!script) {
  const options = logger.colors.blue(scripts.join(', '));
  logger.error(`Unknown script '${script}'; please choose from one of: ${options}.`);
  process.exit(1);
}

// Print help doc and quit
if (argv.includes('--help') && script) {
  const docPath = join(dir, '../docs', script) + '.md';
  if (!existsSync(docPath)) {
    logger.warning(`No documentation was found for ${script}`);
    process.exit(1);
  }

  markedRender(docPath);
  process.exit(0);
}

const nodeArgs = scriptIndex > 0 ? argv.slice(0, scriptIndex) : [];
const scriptPath = require.resolve(`./scripts/${script}`);
const scriptArgs = argv.slice(scriptIndex + 1);
const processArgs = nodeArgs.concat(scriptPath).concat(scriptArgs);

// Temp disallow version while we figure this out
processArgs.push('--disallow-versioning');

// Run the script and then exit
process.exit(spawn(processArgs));
