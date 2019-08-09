import { AuthConfig } from 'flex-dev-utils/dist/credentials';

import getRuntime from '../runtime';

jest.mock('../../clients/builds');
jest.mock('../../clients/environments');
jest.mock('../../clients/services');
jest.mock('flex-dev-utils/dist/credentials');
jest.mock('../../utils/paths', () => ({
  packageName: 'plugin-test',
}));


// tslint:disable
const ServiceClient: jest.Mock = require('../../clients/services').default;
const EnvironmentClient: jest.Mock = require('../../clients/environments').default;
const BuildClient: jest.Mock = require('../../clients/builds').default;
// tslint:enable

describe('runtime', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const environmentSid = 'ZE00000000000000000000000000000000';
  const buildSid = 'ZB00000000000000000000000000000000';

  const auth: AuthConfig = {
    accountSid: 'AC00000000000000000000000000000000',
    authToken: 'abc123',
  };

  const getServiceDefault = jest.fn();
  const getEnvironment = jest.fn();
  const getBuild = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRuntime', () => {
    it('should not fetch build if no build_sid is found', async () => {
      const service = {sid: serviceSid};
      const environment = {sid: environmentSid};
      getServiceDefault.mockImplementation(() => service);
      getEnvironment.mockImplementation(() => environment);

      ServiceClient.mockImplementation(() => ({getDefault: getServiceDefault}));
      EnvironmentClient.mockImplementation(() => ({get: getEnvironment}));
      BuildClient.mockImplementation(() => ({get: getBuild}));

      const runtime = await getRuntime(auth);

      expect(ServiceClient).toHaveBeenCalledTimes(1);
      expect(ServiceClient).toHaveBeenCalledWith(auth);
      expect(getServiceDefault).toHaveBeenCalledTimes(1);

      expect(EnvironmentClient).toHaveBeenCalledTimes(1);
      expect(EnvironmentClient).toHaveBeenCalledWith(auth, serviceSid);
      expect(getEnvironment).toHaveBeenCalledTimes(1);

      expect(BuildClient).not.toHaveBeenCalled();

      expect(runtime.service).toEqual(service);
      expect(runtime.environment).toEqual(environment);
      expect(runtime.build).toBeUndefined();
    });

    it('should fetch build when  build_sid is defined', async () => {
      const service = {sid: serviceSid};
      const environment = {sid: environmentSid, build_sid: buildSid};
      const build = {sid: buildSid};
      getServiceDefault.mockImplementation(() => service);
      getEnvironment.mockImplementation(() => environment);
      getBuild.mockImplementation(() => build);

      ServiceClient.mockImplementation(() => ({getDefault: getServiceDefault}));
      EnvironmentClient.mockImplementation(() => ({get: getEnvironment}));
      BuildClient.mockImplementation(() => ({get: getBuild}));

      const runtime = await getRuntime(auth);

      expect(ServiceClient).toHaveBeenCalledTimes(1);
      expect(ServiceClient).toHaveBeenCalledWith(auth);
      expect(getServiceDefault).toHaveBeenCalledTimes(1);

      expect(EnvironmentClient).toHaveBeenCalledTimes(1);
      expect(EnvironmentClient).toHaveBeenCalledWith(auth, serviceSid);
      expect(getEnvironment).toHaveBeenCalledTimes(1);

      expect(BuildClient).toHaveBeenCalledTimes(1);
      expect(BuildClient).toHaveBeenCalledWith(auth, serviceSid);
      expect(getBuild).toHaveBeenCalledTimes(1);
      expect(getBuild).toHaveBeenCalledWith(buildSid);

      expect(runtime.service).toEqual(service);
      expect(runtime.environment).toEqual(environment);
      expect(runtime.build).toEqual(build);
    });
  });
});
