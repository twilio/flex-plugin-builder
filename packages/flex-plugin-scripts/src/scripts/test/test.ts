import { logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { resolveModulePath } from 'flex-dev-utils/dist/fs';
import * as jest from 'jest';

import getConfiguration, { ConfigurationType } from '../../config';

/**
 * Runs jest
 * @param env
 * @param args
 */
/* istanbul ignore next */
export default async (env: string, ...args: string[]): Promise<void> => {
  const config = await getConfiguration(ConfigurationType.Jest, Environment.Test);
  const runArgs: string[] = [...args];

  runArgs.push('--config', JSON.stringify(config));
  const jestEnvPath = resolveModulePath(`jest-environment-${env}`);
  const envPath = resolveModulePath(env);
  if (jestEnvPath) {
    runArgs.push('--env', jestEnvPath);
  } else if (envPath) {
    runArgs.push('--env', envPath);
  } else {
    logger.warning(`jest-environment ${env} was not found`);
  }

  await jest.run(runArgs);
};
