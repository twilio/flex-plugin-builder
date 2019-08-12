import { progress } from 'flex-dev-utils/dist/ora';
import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import { BuildClient, EnvironmentClient, ServiceClient } from '../clients';
import { Runtime } from '../clients/serverless-types';

/**
 * Fetches the {@link Runtime}
 *
 * @return a Promise of {@link Runtime}
 */
const getRuntime = async (credentials: AuthConfig, serviceOnly = false): Promise<Runtime> => {
  // Fetch the runtime service instance
  return await progress<Runtime>('Fetching Twilio Runtime service', async () => {
    const serverlessClient = new ServiceClient(credentials);
    const service = await serverlessClient.getDefault();

    if (serviceOnly) {
      return { service };
    }

    const environmentClient = new EnvironmentClient(credentials, service.sid);
    const environment = await environmentClient.get();

    // This is the first time we are doing a build, so we don't have a pre-existing build
    const runtime: Runtime = { service, environment };
    if (!environment.build_sid) {
      return runtime;
    }

    const buildClient = new BuildClient(credentials, service.sid);
    runtime.build = await buildClient.get(environment.build_sid);

    return runtime;
  });
};

export default getRuntime;
