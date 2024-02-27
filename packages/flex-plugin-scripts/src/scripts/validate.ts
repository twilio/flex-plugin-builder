import { resolve, join, basename } from 'path';
import os from 'os';

import { logger, getCredential, progress } from '@twilio/flex-dev-utils';
import {
  addCWDNodeModule,
  getPaths,
  zipPluginFiles,
  writeJSONFile,
  removeFile,
  getPackageVersion,
  mkdirpSync,
  checkAFileExists,
} from '@twilio/flex-dev-utils/dist/fs';

import { setEnvironment } from '..';
import run from '../utils/run';
import { GovernorClient } from '../clients';
import { ValidateReport } from '../clients/governor';
import { validateSuccessful } from '../prints';

/**
 * Builds the bundle
 */
const validate = async (...argv: string[]): Promise<void> => {
  setEnvironment(...argv);
  logger.debug('Running validation on Flex plugin bundle');

  addCWDNodeModule(...argv);

  logger.clearTerminal();
  logger.notice('Validating Plugin...');
  logger.newline();

  const paths = getPaths();

  const zipFile = resolve(os.tmpdir(), `tmp-${Date.now()}.zip`);

  const credentials = await getCredential();
  const governorClient = new GovernorClient(credentials.username, credentials.password);

  const pkgName = logger.coloredStrings.bold.yellow(paths.app.name);
  const flexUIVersion = getPackageVersion('@twilio/flex-ui');

  try {
    await progress('Preparing the plugin', async () => {
      const dirName = basename(paths.cwd);
      zipPluginFiles(zipFile, dirName, paths.app.srcDir, paths.app.pkgPath);
    });

    const report = await progress('Generating validation report', async (): Promise<ValidateReport> => {
      return governorClient.validate(zipFile, paths.app.name, flexUIVersion);
    });

    if (
      report.api_compatibility.length > 0 ||
      report.version_compatibility[0].warnings.length > 0 ||
      report.dom_manipulation.length > 0 ||
      report.errors.length > 0
    ) {
      if (!checkAFileExists(paths.cwd, 'logs')) {
        mkdirpSync('logs');
      }
      const validateFile = join(paths.cwd, 'logs', `validate-${Date.now()}.json`);
      writeJSONFile(report, validateFile);
    }

    validateSuccessful(report);
  } catch (e: any) {
    logger.error(`Validation of plugin ${pkgName} failed with error: ${(e as Error).message}`);
  }

  removeFile(zipFile);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(validate);

// eslint-disable-next-line import/no-unused-modules
export default validate;
