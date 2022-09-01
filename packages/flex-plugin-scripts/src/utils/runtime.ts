import { progress, Credential } from '@twilio/flex-dev-utils';

import {
  ServerlessRuntime,
  BuildClient,
  ConfigurationClient,
  EnvironmentClient,
  ServerlessClient,
  ServiceClient,
} from '../clients';

/**
 * Fetches the {@link Runtime}
 *
 * @return a Promise of {@link Runtime}
 */
const getRuntime = async (credentials: Credential, serviceOnly = false): Promise<ServerlessRuntime> => {
  // Fetch the runtime service instance
  return progress('Fetching Twilio Runtime service', async () => {
    const serverlessClient = new ServerlessClient(credentials.username, credentials.password);
    const serviceClient = new ServiceClient(serverlessClient);
    const configurationClient = new ConfigurationClient(credentials.username, credentials.password);

    const serviceSid = (await configurationClient.getServiceSids())[0];
    const service = serviceSid ? await serviceClient.get(serviceSid) : await serviceClient.getDefault();

    if (serviceOnly) {
      return { service };
    }

    const environmentClient = new EnvironmentClient(serverlessClient, service.sid);
    const environment = await environmentClient.get();

    // This is the first time we are doing a build, so we don't have a pre-existing build
    const runtime: ServerlessRuntime = { service, environment };
    if (!environment.build_sid) {
      return runtime;
    }

    const buildClient = new BuildClient(serverlessClient, service.sid);
    runtime.build = await buildClient.get(environment.build_sid);

    return runtime;
  });
};

export default getRuntime;
