import { ServiceListInstance } from 'twilio/lib/rest/serverless/v1/service';
import { Logger } from '@oclif/errors';
import { BuildListInstanceCreateOptions } from 'twilio/lib/rest/serverless/v1/service/build';

import ServerlessClient from '../../clients/ServerlessClient';

describe('ServerlessClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const buildSid = 'ZB00000000000000000000000000000000';
  const environmentSid = 'ZE00000000000000000000000000000000';
  const pluginName = 'plugin-name';
  const environment = { sid: environmentSid, uniqueName: pluginName, buildSid };
  const mainPath = '/some/path';
  const anotherPath = '/another/path';
  const pluginPath = `/plugins/${pluginName}/0.0.0/bundle.js`;

  const listEnv = jest.fn();
  const removeEnv = jest.fn();
  const getBuild = jest.fn();
  const getService = jest.fn();
  const createService = jest.fn();
  const fetch = jest.fn();
  getService.mockReturnValue({
    fetch,
    environments: {
      list: listEnv,
    },
    builds: {
      get: () => ({
        fetch: getBuild,
      }),
    },
  });
  const debug = jest.fn();
  // @ts-ignore
  const logger: Logger = { debug } as Logger;

  // @ts-ignore
  const twilioClient = { get: getService, create: createService } as ServiceListInstance;

  let client: ServerlessClient;

  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    client = new ServerlessClient(twilioClient, logger as Logger);
  });

  describe('getLegacyAsset', () => {
    it('should return false ', async () => {
      const build = {
        assetVersions: [{ path: mainPath }, { path: anotherPath }],
      };

      // @ts-ignore
      expect(client.getLegacyAsset(build, pluginName)).toEqual(undefined);
    });

    it('should return true', async () => {
      const build = {
        assetVersions: [{ path: pluginPath }, { path: anotherPath }],
      };
      // @ts-ignore
      expect(client.getLegacyAsset(build, pluginName)).toEqual(build.assetVersions[0]);
    });
  });

  describe('hasLegacy', () => {
    it('should return false if no build is found', async () => {
      // @ts-ignore
      jest.spyOn(client, 'getBuildAndEnvironment').mockResolvedValue({});

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).toEqual(false);
      // @ts-ignore
      const { getBuildAndEnvironment } = client;
      expect(getBuildAndEnvironment).toHaveBeenCalledTimes(1);
      expect(getBuildAndEnvironment).toHaveBeenCalledWith(serviceSid, pluginName);
    });

    it('should return false if no bundle is found', async () => {
      const build = {
        assetVersions: [{ path: mainPath }, { path: anotherPath }],
      };
      // @ts-ignore
      jest.spyOn(client, 'getBuildAndEnvironment').mockResolvedValue({ build });

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).toEqual(false);
    });

    it('should return true', async () => {
      const build = {
        assetVersions: [{ path: pluginPath }, { path: anotherPath }],
      };
      // @ts-ignore
      jest.spyOn(client, 'getBuildAndEnvironment').mockResolvedValue({ build });

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).toEqual(true);
    });
  });

  describe('deleteEnvironment', () => {
    it('should delete the environment', async () => {
      jest.spyOn(client, 'getService').mockResolvedValue({
        environments: () => ({
          // @ts-ignore
          get: () => ({
            remove: removeEnv,
          }),
        }),
      });

      removeEnv.mockResolvedValue(true);

      const result = await client.deleteEnvironment(serviceSid, environmentSid);

      expect(removeEnv).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });
  });

  describe('getEnvironment', () => {
    it('should get the environment', async () => {
      fetch.mockResolvedValue({
        environments: () => ({
          list: listEnv,
        }),
      });
      listEnv.mockResolvedValue([environment]);

      const result = await client.getEnvironment(serviceSid, pluginName);

      expect(listEnv).toHaveBeenCalledTimes(1);
      expect(result).toEqual(environment);
    });

    it('should return null if the service does not exist', async () => {
      fetch.mockResolvedValue(null);
      const result = await client.getEnvironment(serviceSid, pluginName);

      expect(listEnv).not.toHaveBeenCalled();
      expect(result).toEqual(null);
    });

    it('should return null if the environment does not exist', async () => {
      fetch.mockResolvedValue({
        environments: () => ({
          list: listEnv,
        }),
      });
      listEnv.mockResolvedValue([]);

      const result = await client.getEnvironment(serviceSid, pluginName);

      expect(listEnv).toHaveBeenCalledTimes(1);
      expect(result).toEqual(null);
    });
  });

  describe('getOrCreateDefaultService', () => {
    it('should return existing service', async () => {
      const service1 = { uniqueName: 'default' };
      const service2 = { uniqueName: 'anotherName' };

      // @ts-ignore
      jest.spyOn(client, 'listServices').mockResolvedValue([service1, service2]);

      const service = await client.getOrCreateDefaultService();

      expect(service).toEqual(service1);
      expect(client.listServices).toHaveBeenCalledTimes(1);
      expect(createService).not.toHaveBeenCalled();
    });

    it('should not find service and instead create a new service', async () => {
      const service1 = { uniqueName: 'notDefault' };
      const service2 = { uniqueName: 'anotherName' };
      const newService = { uniqueName: 'default' };

      // @ts-ignore
      jest.spyOn(client, 'listServices').mockResolvedValue([service1, service2]);
      createService.mockResolvedValue(newService);

      const service = await client.getOrCreateDefaultService();

      expect(service).toEqual(newService);
      expect(client.listServices).toHaveBeenCalledTimes(1);
      expect(createService).toHaveBeenCalledTimes(1);
      expect(createService).toHaveBeenCalledWith(ServerlessClient.NewService);
    });

    it('should create a new service because no services have been found', async () => {
      const newService = { uniqueName: 'default' };

      // @ts-ignore
      jest.spyOn(client, 'listServices').mockResolvedValue([]);
      createService.mockResolvedValue(newService);

      const service = await client.getOrCreateDefaultService();

      expect(service).toEqual(newService);
      expect(client.listServices).toHaveBeenCalledTimes(1);
      expect(createService).toHaveBeenCalledTimes(1);
      expect(createService).toHaveBeenCalledWith(ServerlessClient.NewService);
    });
  });

  describe('createBuildAndDeploy', () => {
    const request: BuildListInstanceCreateOptions = {
      assetVersions: [],
      functionVersions: [],
      dependencies: '',
    };
    const build = { sid: buildSid };

    it('should not create a build if no environment is found', async () => {
      // @ts-ignore
      const getBuildAndEnvironment = jest.spyOn(client, 'getBuildAndEnvironment').mockResolvedValue({});
      // @ts-ignore
      const createBuild = jest.spyOn(client, 'createBuild');

      await client.createBuildAndDeploy(serviceSid, pluginName, request);

      expect(getBuildAndEnvironment).toHaveBeenCalledTimes(1);
      expect(getBuildAndEnvironment).toHaveBeenCalledWith(serviceSid, pluginName);
      expect(createBuild).not.toHaveBeenCalled();
    });

    it('should create a new build and deploy it', async () => {
      const create = jest.fn();
      const environment = {
        deployments: () => ({ create }),
      };
      // @ts-ignore
      const getBuildAndEnvironment = jest.spyOn(client, 'getBuildAndEnvironment').mockResolvedValue({ environment });
      // @ts-ignore
      const createBuild = jest.spyOn(client, 'createBuild').mockResolvedValue(build);

      await client.createBuildAndDeploy(serviceSid, pluginName, request);

      expect(getBuildAndEnvironment).toHaveBeenCalledTimes(1);
      expect(getBuildAndEnvironment).toHaveBeenCalledWith(serviceSid, pluginName);
      expect(createBuild).toHaveBeenCalledTimes(1);
      expect(createBuild).toHaveBeenCalledWith(serviceSid, request);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith({ buildSid: build.sid });
    });
  });

  describe('getBuild', () => {
    const build = { sid: buildSid };

    it('should get the build', async () => {
      // @ts-ignore
      const getBuildAndEnvironment = jest.spyOn(client, 'getBuildAndEnvironment').mockResolvedValue({ build });

      const resp = await client.getBuild(serviceSid, pluginName);

      expect(resp).toEqual(build);
      expect(getBuildAndEnvironment).toHaveBeenCalledTimes(1);
      expect(getBuildAndEnvironment).toHaveBeenCalledWith(serviceSid, pluginName);
    });
  });
});
