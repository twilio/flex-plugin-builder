import { logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { resolveModulePath } from 'flex-dev-utils/dist/require';
import * as jest from 'jest';
import getConfiguration, { ConfigurationType } from '../../config';

export default (env: string, ...args: string[]) => {
  const config = getConfiguration(ConfigurationType.Jest, Environment.Test);
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

  jest.run(runArgs);
};
