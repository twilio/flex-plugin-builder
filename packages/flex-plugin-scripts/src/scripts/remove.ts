import { logger, progress } from 'flex-dev-utils';
import { confirm } from 'flex-dev-utils/dist/inquirer';
import { AuthConfig, getCredential } from 'flex-dev-utils/dist/credentials'; ;
import { EnvironmentClient } from '../clients';
import { Runtime } from '../clients/serverless-types';

import paths from '../utils/paths';
import run from '../utils/run';
import getRuntime from '../utils/runtime';

/**
 * Attempts to fetch the Service and Environment. If no Environment is found, will quit the script
 *
 * @param credentials the credentials
 * @private
 */
export const _getRuntime = async (credentials: AuthConfig): Promise<Runtime> => {
  const runtime = await getRuntime(credentials, true);
  const environmentClient = new EnvironmentClient(credentials, runtime.service.sid);

  try {
    const environment = await environmentClient.get(false);

    return {
      environment,
      service: runtime.service,
    };
  } catch (e) {
    const pluginName = logger.colors.blue(paths.packageName);

    logger.newline();
    logger.info(`⚠️  Plugin ${pluginName} was not found or was already removed.`);

    return process.exit(0);
  }
};

/**
 * Performs the delete action
 * @private
 */
export const _doRemove = async () => {
  const pluginName = logger.colors.blue(paths.packageName);
  const credentials = await getCredential();
  const runtime = await _getRuntime(credentials);

  await progress(`Deleting plugin ${pluginName}`, async () => {
    const environmentClient = new EnvironmentClient(credentials, runtime.service.sid);
    await environmentClient.remove(runtime.environment.sid);
  });

  logger.newline();
  logger.info(`🎉️  Plugin ${pluginName} was successfully removed.`);

  process.exit(0);
};

/**
 * Removes the plugin by deleting it's associated Environment
 */
const remove = async () => {
  logger.debug('Removing Flex plugin');

  const pluginName = logger.colors.blue(paths.packageName);
  const question = `Are you sure you want to permanently remove plugin ${pluginName}?`;
  const answer = await confirm(question, 'N');

  if (!answer) {
    return process.exit(0);
  }

  await _doRemove();
};

run(remove);

export default remove;
