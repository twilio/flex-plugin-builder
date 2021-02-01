import { ServiceListInstance } from 'twilio/lib/rest/serverless/v1/service';
import { Logger } from '@oclif/errors';

import ServerlessClient from '../../clients/ServerlessClient';

describe('ServerlessClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const pluginName = 'plugin-name';
  const mainPath = '/some/path';
  const anotherPath = '/another/path';
  const pluginPath = `/plugins/${pluginName}/0.0.0/bundle.js`;

  const listEnv = jest.fn();
  const getBuild = jest.fn();
  const getService = jest.fn();
  const createService = jest.fn();
  getService.mockReturnValue({
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
  // @ts-ignore
  const client = new ServerlessClient(twilioClient, logger as Logger);

  beforeEach(() => {
    jest.resetAllMocks();
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
});
