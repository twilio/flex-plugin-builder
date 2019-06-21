import { progress } from 'flex-dev-utils/dist/ora';
import { BuildClient, EnvironmentClient, ServiceClient } from '../clients';
import { AuthConfig } from '../clients/auth';
import { Build, Environment, Runtime, Service } from '../clients/serverless-types';

/**
 * Fetches the Runtime environment. This includes:
 * the {@link Service}, the {@link Environment}, and the {@link Build}
 */
const getRuntime = async (credentials: AuthConfig): Promise<Runtime> => {
  // Fetch the runtime service instance
  return await progress<Runtime>('Fetching Twilio Runtime service', async () => {
    const serverlessClient = new ServiceClient(credentials);
    const service = await serverlessClient.getDefault();

    const environmentClient = new EnvironmentClient(credentials, service.sid);
    const environment = await environmentClient.getDefault();

    const runtime: Runtime = { service, environment };

    const buildClient = new BuildClient(credentials, service.sid);
    // This is the first time we are doing a build, so we don't have a pre-existing build
    if (!environment.build_sid) {
      return runtime;
    }

    runtime.build = await buildClient.get(environment.build_sid);

    return runtime;
  });
};

export default getRuntime;
