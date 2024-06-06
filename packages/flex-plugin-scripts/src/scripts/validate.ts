import { resolve, join, basename } from 'path';
import os from 'os';
import { performance } from 'perf_hooks';

import { logger, getCredential, progress, TwilioCliError } from '@twilio/flex-dev-utils';
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

const LEGAL_DISCLAIMER =
  'By running the Flex plugins validate command, you acknowledge that the recommendations offered by this tool are suggestions to help with your Flex plugin deployment, but may not represent the only solution available to you. It is ultimately your responsibility to validate these recommendations and determine if they are appropriate for your use case.';

const ETIMEDOUT = 'ETIMEDOUT';

/**
 * Builds the bundle
 */
const validate = async (
  ...argv: string[]
): Promise<{
  violations: string[];
  vtime: number;
  error?: {
    message: string;
    timedOut: boolean;
  };
}> => {
  const isDeploy = argv.includes('--deploy');
  const isFlexUI2 = argv.includes('--flex-ui-2.0');
  logger.debug('Running validation on Flex plugin bundle');

  setEnvironment(...argv);
  addCWDNodeModule(...argv);

  // Do not print these log statements if validate is run as part of deploy command
  if (!isDeploy) {
    logger.clearTerminal();
    logger.notice('Validating Plugin...');
  }

  logger.notice(logger.coloredStrings.bold(logger.coloredStrings.underline('\nDISCLAIMER')));
  logger.notice(`${logger.wrap(LEGAL_DISCLAIMER, process.stdout.columns || 100)}${isDeploy ? '' : '\n'}`);

  const paths = getPaths();
  const zipFile = resolve(os.tmpdir(), `tmp-${Date.now()}.zip`);
  const credentials = await getCredential();
  const governorClient = new GovernorClient(credentials.username, credentials.password);
  const flexUIVersion = isFlexUI2 ? '2.x' : getPackageVersion('@twilio/flex-ui');
  const pkgName = logger.coloredStrings.bold.yellow(paths.app.name);

  // Start timer for calculating time taken to validate the plugin
  const start = performance.now();

  // Zips the plugin src folder and package.json
  const zipPlugin = () => {
    const dirName = basename(paths.cwd);
    zipPluginFiles(zipFile, dirName, paths.app.srcDir, paths.app.pkgPath);
    logger.debug(`zipped plugin files into folder ${dirName} inside zip file ${zipFile}`);
  };

  // Make the req to plugin governor to validate the zipped plugin
  const validatePlugin = async (): Promise<ValidateReport> => {
    return governorClient.validate(zipFile, paths.app.name, flexUIVersion);
  };

  let report!: ValidateReport;

  try {
    // Do not run as progress steps if validate is run as part of deploy
    if (isDeploy) {
      zipPlugin();
      report = await validatePlugin();
    } else {
      await progress('Preparing the plugin', async () => zipPlugin());
      report = await progress(`Validating plugin ${logger.coloredStrings.bold(paths.app.name)}`, async () =>
        validatePlugin(),
      );
    }

    // Generate a log file if report is not empty
    if (
      report.api_compatibility.length > 0 ||
      report.version_compatibility[0]?.warnings.length > 0 ||
      report.dom_manipulation.length > 0 ||
      report.errors.length > 0
    ) {
      if (!checkAFileExists(paths.cwd, 'logs')) {
        mkdirpSync('logs');
      }
      const validateFile = join(paths.cwd, 'logs', `validate-${report.request_id}.json`);
      writeJSONFile(report, validateFile);
    }

    // Print validation report
    validateSuccessful(report);
  } catch (e: any) {
    const errResponse = e.response?.data;
    const errMessage = errResponse?.message || errResponse?.params.error_detail;
    const timedOut = e?.code === ETIMEDOUT;

    removeFile(zipFile);

    logger.newline();

    if (timedOut) {
      logger.error('Plugin validation timed out. Note: This may be an enterprise firewall issue');
    } else if (errMessage) {
      logger.error(`${errMessage}`);
    } else {
      logger.error('Unable to validate the plugin at the moment.');
    }

    if (isDeploy) {
      return {
        violations: [],
        vtime: 0,
        error: {
          message: e?.message,
          timedOut,
        },
      };
    }

    logger.error(`\n\nValidation of plugin ${pkgName} failed`);
    throw new TwilioCliError();
  }

  removeFile(zipFile);

  // End the timer
  const end = performance.now();

  return {
    violations: [
      ...report.api_compatibility.reduce(
        (acc: string[], { warnings }) => [...acc, ...warnings.map(({ id }) => id)],
        [],
      ), // API Compatibility Violations
      ...(report.version_compatibility[0]?.warnings.map(({ id }) => id) || []), // Version Compatibility Violations
    ],
    vtime: end - start,
  };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(validate);

// eslint-disable-next-line import/no-unused-modules
export default validate;
