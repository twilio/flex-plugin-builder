import { resolve, join } from 'path';
import os from 'os';

import { env, logger, getCredential, progress } from '@twilio/flex-dev-utils';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { addCWDNodeModule, getPaths, zipPluginFiles, writeJSONFile, removeFile } from '@twilio/flex-dev-utils/dist/fs';

import { setEnvironment } from '..';
import run from '../utils/run';
import { GovernorClient } from '../clients';

/**
 * Builds the bundle
 */
const validate = async (...argv: string[]): Promise<void> => {
  setEnvironment(...argv);
  logger.debug('Running validation on Flex plugin bundle');

  addCWDNodeModule(...argv);

  env.setBabelEnv(Environment.Development);
  env.setNodeEnv(Environment.Development);

  logger.clearTerminal();
  logger.notice('Validating Plugin...');
  logger.newline();

  const paths = getPaths();

  const zipFile = resolve(os.tmpdir(), `tmp-${Date.now()}.zip`);

  const credentials = await getCredential();
  const governorClient = new GovernorClient(credentials.username, credentials.password);

  const pkgName = logger.coloredStrings.bold.yellow(paths.app.name);

  try {
    await progress('Preparing the plugin', async () => {
      zipPluginFiles(zipFile, 'plugin', paths.app.srcDir, paths.app.pkgPath);
    });

    const report = await progress('Generating validation report', async () => {
      return governorClient.validate(zipFile);
    });

    const validateFile = join(paths.cwd, 'validate.json');

    writeJSONFile(report, validateFile);

    const noDeprecatedWarnings = report.deprecated_api_usage.reduce((acc: number, warning: any) => {
      acc += warning.messages.length;
      return acc;
    }, 0);

    const noDomWarnings = report.dom_manipulation.reduce((acc: number, warning: any) => {
      acc += warning.messages.length;
      return acc;
    }, 0);

    const noDependencyWarnings = report.version_incompatibility[0]?.messages.length || 0;

    logger.newline();

    if (noDeprecatedWarnings > 0 || noDomWarnings > 0 || noDependencyWarnings > 0) {
      logger.warning(
        `Validation complete. Found:\n${logger.coloredStrings.error(
          noDeprecatedWarnings,
        )} deprecation warnings\n${logger.coloredStrings.error(
          noDomWarnings,
        )} dom manipulation statements\n${logger.coloredStrings.error(
          noDependencyWarnings,
        )} version incompatibility issues`,
      );
      logger.newline();
      logger.info(`To see more, go to ${logger.coloredStrings.link(validateFile)}`);
    } else {
      logger.success(`Validation complete. Found ${logger.coloredStrings.digit(0)} errors 🎉`);
    }
  } catch (e) {
    logger.error(`Validation of plugin ${pkgName} failed!`);
  }

  removeFile(zipFile);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(validate);

// eslint-disable-next-line import/no-unused-modules
export default validate;
