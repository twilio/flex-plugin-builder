/* eslint-disable camelcase */
import { Credential } from '@twilio/flex-dev-utils';
import * as fsScript from '@twilio/flex-dev-utils/dist/fs';

import getRuntime from '../runtime';

jest.mock('../../clients/builds');
jest.mock('../../clients/configurations');
jest.mock('../../clients/serverless-client');
jest.mock('../../clients/environments');
jest.mock('../../clients/services');
jest.mock('@twilio/flex-dev-utils/dist/credentials');

/* eslint-disable */
const ServiceClient: jest.Mock = require('../../clients/services').default;
const ServerlessClient: jest.Mock = require('../../clients/serverless-client').default;
const EnvironmentClient: jest.Mock = require('../../clients/environments').default;
const BuildClient: jest.Mock = require('../../clients/builds').default;
const ConfigurationClient: jest.Mock = require('../../clients/configurations').default;
/* eslint-enable */

describe('runtime', () => {
  const paths = {
    app: {
      name: 'plugin-test',
    },
  };

  const serviceSid = 'ZS00000000000000000000000000000000';
  const environmentSid = 'ZE00000000000000000000000000000000';
  const buildSid = 'ZB00000000000000000000000000000000';
  const service = { sid: serviceSid };
  const environment = { sid: environmentSid };
  // eslint-disable-next-line camelcase
  const environmentWithBuild = { sid: environmentSid, build_sid: buildSid };
  const build = { sid: buildSid };

  const auth: Credential = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc123',
  };

  const serviceGet = jest.fn();
  const getServiceDefault = jest.fn();
  const getEnvironment = jest.fn();
  const getBuild = jest.fn();
  const configGetServiceSids = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    jest.spyOn(fsScript, 'getPaths').mockReturnValue(paths);
  });

  const expectConfigurationClientCalled = () => {
    expect(ConfigurationClient).toHaveBeenCalledTimes(1);
    expect(ConfigurationClient).toHaveBeenCalledWith(auth.username, auth.password);
    expect(configGetServiceSids).toHaveBeenCalledTimes(1);
  };

  const expectServiceClientCalled = (getDefaultCalled = true) => {
    expect(ServerlessClient).toHaveBeenCalledTimes(1);
    expect(ServerlessClient).toHaveBeenCalledWith(auth.username, auth.password);
    expect(ServiceClient).toHaveBeenCalledTimes(1);
    expect(ServiceClient).toHaveBeenCalledWith(expect.any(ServerlessClient));
    if (getDefaultCalled) {
      expect(getServiceDefault).toHaveBeenCalledTimes(1);
      expect(serviceGet).not.toHaveBeenCalled();
    } else {
      expect(getServiceDefault).not.toHaveBeenCalled();
      expect(serviceGet).toHaveBeenCalledTimes(1);
    }
  };

  const expectEnvironmentClientCalled = () => {
    expect(ServerlessClient).toHaveBeenCalledTimes(1);
    expect(ServerlessClient).toHaveBeenCalledWith(auth.username, auth.password);
    expect(EnvironmentClient).toHaveBeenCalledTimes(1);
    expect(EnvironmentClient).toHaveBeenCalledWith(expect.any(ServerlessClient), serviceSid);
    expect(getEnvironment).toHaveBeenCalledTimes(1);
  };

  const expectBuildClientCalled = () => {
    expect(ServerlessClient).toHaveBeenCalledTimes(1);
    expect(ServerlessClient).toHaveBeenCalledWith(auth.username, auth.password);
    expect(BuildClient).toHaveBeenCalledTimes(1);
    expect(BuildClient).toHaveBeenCalledWith(expect.any(ServerlessClient), serviceSid);
    expect(getBuild).toHaveBeenCalledTimes(1);
    expect(getBuild).toHaveBeenCalledWith(buildSid);
  };

  describe('getRuntime', () => {
    it('should not fetch build if no build_sid is found', async () => {
      getServiceDefault.mockReturnValue(service);
      getEnvironment.mockReturnValue(environment);
      configGetServiceSids.mockReturnValue([]);

      ServiceClient.mockImplementation(() => ({ getDefault: getServiceDefault }));
      EnvironmentClient.mockImplementation(() => ({ get: getEnvironment }));
      BuildClient.mockImplementation(() => ({ get: getBuild }));
      ConfigurationClient.mockImplementation(() => ({ getServiceSids: configGetServiceSids }));

      const runtime = await getRuntime(auth);

      expectConfigurationClientCalled();
      expectServiceClientCalled();
      expectEnvironmentClientCalled();

      expect(BuildClient).not.toHaveBeenCalled();

      expect(runtime.service).toEqual(service);
      expect(runtime.environment).toEqual(environment);
      expect(runtime.build).toBeUndefined();
    });

    it('should fetch build when build_sid is defined', async () => {
      getServiceDefault.mockReturnValue(service);
      getEnvironment.mockReturnValue(environmentWithBuild);
      getBuild.mockReturnValue(build);
      configGetServiceSids.mockReturnValue([]);

      ServiceClient.mockImplementation(() => ({ getDefault: getServiceDefault }));
      EnvironmentClient.mockImplementation(() => ({ get: getEnvironment }));
      BuildClient.mockImplementation(() => ({ get: getBuild }));
      ConfigurationClient.mockImplementation(() => ({ getServiceSids: configGetServiceSids }));

      const runtime = await getRuntime(auth);

      expectConfigurationClientCalled();
      expectServiceClientCalled();
      expectEnvironmentClientCalled();
      expectBuildClientCalled();

      expect(runtime.service).toEqual(service);
      expect(runtime.environment).toEqual(environmentWithBuild);
      expect(runtime.build).toEqual(build);
    });

    it('should return service only', async () => {
      getServiceDefault.mockReturnValue(service);
      configGetServiceSids.mockReturnValue([]);

      ServiceClient.mockImplementation(() => ({ getDefault: getServiceDefault }));
      ConfigurationClient.mockImplementation(() => ({ getServiceSids: configGetServiceSids }));

      const runtime = await getRuntime(auth, true);

      expectConfigurationClientCalled();
      expectServiceClientCalled();

      expect(EnvironmentClient).not.toHaveBeenCalled();
      expect(BuildClient).not.toHaveBeenCalled();

      expect(runtime.service).toEqual(service);
      expect(runtime).not.toHaveProperty('environment');
      expect(runtime).not.toHaveProperty('build');
    });

    it('should use configuration service only', async () => {
      serviceGet.mockReturnValue(service);
      configGetServiceSids.mockReturnValue([serviceSid]);

      ServiceClient.mockImplementation(() => ({ get: serviceGet }));
      ConfigurationClient.mockImplementation(() => ({ getServiceSids: configGetServiceSids }));

      const runtime = await getRuntime(auth, true);

      expectConfigurationClientCalled();
      expectServiceClientCalled(false);

      expect(runtime.service).toEqual(service);
      expect(runtime).not.toHaveProperty('environment');
      expect(runtime).not.toHaveProperty('build');
    });
  });
});
