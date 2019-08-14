import { existsSync, copyFileSync } from 'fs';
import { logger } from 'flex-dev-utils';
import { singleLineString } from 'flex-dev-utils/dist/strings';

import { join } from 'path';
import run from '../utils/run';

const appConfigPath = join(process.cwd(), 'public', 'appConfig.js');
const indexSourcePath = join(__dirname, '..', '..', 'dev_assets', 'index.html');
const indexTargetPath = join(process.cwd(), 'public', 'index.html');

const link = logger.coloredStrings.link;

// Constant error message to display if required files are not found
const appConfigMissingErrorMsg = singleLineString(
  `Could not find ${link('public/appConfig.js')}.`,
  `Check your ${link('public/')} directory for ${link('appConfig.example.js')},`,
  `copy it to ${link('appConfig.js')}, and modify your Account Sid and Service URL.`,
);

/**
 * Runs pre-start/build checks
 */
const checkStart = async () => {
  if (!existsSync(appConfigPath)) {
    logger.error(appConfigMissingErrorMsg);

    return process.exit(1);
  }

  try {
    copyFileSync(indexSourcePath, indexTargetPath);
  } catch (e) {
    logger.error(`Failed to copy ${link('index.html')} into ${link('public/')} directory.`);
    logger.newline();
    logger.error(e);
    logger.newline();

    return process.exit(1);
  }
};

run(checkStart);

export default checkStart;
