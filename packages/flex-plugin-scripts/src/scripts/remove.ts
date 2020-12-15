import { logger, progress, Credential, getCredential, exit } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import { confirm } from 'flex-dev-utils/dist/inquirer';
import { getPaths } from 'flex-dev-utils/dist/fs';

import { EnvironmentClient } from '../clients';
import { Runtime } from '../clients/serverless-types';
import run from '../utils/run';
import getRuntime from '../utils/runtime';

/**
 * Attempts to fetch the Service and Environment. If no Environment is found, will quit the script
 *
 * @param credentials the credentials
 * @private
 */
export const _getRuntime = async (credentials: Credential): Promise<Runtime> => {
  const runtime = await getRuntime(credentials, true);
  const environmentClient = new EnvironmentClient(credentials, runtime.service.sid);

  try {
    const environment = await environmentClient.get(false);

    return {
      environment,
      service: runtime.service,
    };
  } catch (e) {
    const pluginName = logger.colors.blue(getPaths().app.name);

    logger.newline();
    logger.info(`⚠️  Plugin ${pluginName} was not found or was already removed.`);

    exit(0);

    // This is to make TS happy
    return {} as Runtime;
  }
};

/**
 * Performs the delete action
 * @private
 */
export const _doRemove = async () => {
  const pluginName = logger.colors.blue(getPaths().app.name);
  const credentials = await getCredential();
  const runtime = await _getRuntime(credentials);
  if (!runtime.environment) {
    throw new FlexPluginError('No Runtime environment was found');
  }
  const { environment } = runtime;

  await progress(`Deleting plugin ${pluginName}`, async () => {
    const environmentClient = new EnvironmentClient(credentials, runtime.service.sid);
    await environmentClient.remove(environment.sid);
  });

  logger.newline();
  logger.info(`🎉️  Plugin ${pluginName} was successfully removed.`);

  exit(0);
};

/**
 * Removes the plugin by deleting it's associated Environment
 */
const remove = async () => {
  logger.debug('Removing plugin');

  const pluginName = logger.colors.blue(getPaths().app.name);
  const question = `Are you sure you want to permanently remove plugin ${pluginName}?`;
  const answer = await confirm(question, 'N');

  if (!answer) {
    exit(0);
    return;
  }

  await _doRemove();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(remove);

export default remove;
