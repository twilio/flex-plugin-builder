import { expect } from 'chai';
import { ServiceListInstance } from 'twilio/lib/rest/serverless/v1/service';
import { Logger } from '@oclif/errors';

import { sinon } from '../framework';
import ServerlessClient from '../../clients/ServerlessClient';

describe('ServerlessClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const pluginName = 'plugin-name';

  const listEnv = sinon.stub();
  const getBuild = sinon.stub();
  const getService = sinon.stub();
  const createService = sinon.stub();
  getService.returns({
    environments: {
      list: listEnv,
    },
    builds: {
      get: () => ({
        fetch: getBuild,
      }),
    },
  });
  const debug = sinon.stub();
  // @ts-ignore
  const logger: Logger = { debug } as Logger;

  // @ts-ignore
  const twilioClient = { get: getService, create: createService } as ServiceListInstance;
  // @ts-ignore
  const client = new ServerlessClient(twilioClient, logger as Logger);

  beforeEach(() => {
    sinon.restore();
  });

  describe('getLegacyAsset', () => {
    it('should return false ', async () => {
      const build = {
        assetVersions: [
          {
            path: '/some/path',
          },
          {
            path: 'another-path',
          },
        ],
      };

      // @ts-ignore
      expect(client.getLegacyAsset(build, pluginName)).to.equal(undefined);
    });

    it('should return true', async () => {
      const build = {
        assetVersions: [
          {
            path: `/plugins/${pluginName}/0.0.0/bundle.js`,
          },
          {
            path: 'another-path',
          },
        ],
      };
      // @ts-ignore
      expect(client.getLegacyAsset(build, pluginName)).to.equal(build.assetVersions[0]);
    });
  });

  describe('hasLegacy', () => {
    it('should return false if no build is found', async () => {
      // @ts-ignore
      sinon.stub(client, 'getBuildAndEnvironment').returns(Promise.resolve({}));

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).to.equal(false);
      // @ts-ignore
      const { getBuildAndEnvironment } = client;
      expect(getBuildAndEnvironment).to.have.been.calledOnce;
      expect(getBuildAndEnvironment).to.have.been.calledWith(serviceSid, pluginName);
    });

    it('should return false if no bundle is found', async () => {
      const build = {
        assetVersions: [
          {
            path: '/some/path',
          },
          {
            path: 'another-path',
          },
        ],
      };
      // @ts-ignore
      sinon.stub(client, 'getBuildAndEnvironment').returns(Promise.resolve({ build }));

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).to.equal(false);
    });

    it('should return true', async () => {
      const build = {
        assetVersions: [
          {
            path: `/plugins/${pluginName}/0.0.0/bundle.js`,
          },
          {
            path: 'another-path',
          },
        ],
      };
      // @ts-ignore
      sinon.stub(client, 'getBuildAndEnvironment').returns(Promise.resolve({ build }));

      const result = await client.hasLegacy(serviceSid, pluginName);

      expect(result).to.equal(true);
    });
  });

  describe('getOrCreateDefaultService', () => {
    beforeEach(() => {
      createService.reset();
    });

    it('should return existing service', async () => {
      const service1 = { uniqueName: 'default' };
      const service2 = { uniqueName: 'anotherName' };

      // @ts-ignore
      sinon.stub(client, 'listServices').returns(Promise.resolve([service1, service2]));

      const service = await client.getOrCreateDefaultService();

      expect(service).to.eql(service1);
      expect(client.listServices).to.have.been.calledOnce;
      expect(createService).not.to.have.been.called;
    });

    it('should not find service and instead create a new service', async () => {
      const service1 = { uniqueName: 'notDefault' };
      const service2 = { uniqueName: 'anotherName' };
      const newService = { uniqueName: 'default' };

      // @ts-ignore
      sinon.stub(client, 'listServices').returns(Promise.resolve([service1, service2]));
      createService.returns(Promise.resolve(newService));

      const service = await client.getOrCreateDefaultService();

      expect(service).to.eql(newService);
      expect(client.listServices).to.have.been.calledOnce;
      expect(createService).to.have.been.calledOnce;
      expect(createService).to.have.been.calledWith(ServerlessClient.NewService);
    });

    it('should create a new service because no services have been found', async () => {
      const newService = { uniqueName: 'default' };

      // @ts-ignore
      sinon.stub(client, 'listServices').returns(Promise.resolve([]));
      createService.returns(Promise.resolve(newService));

      const service = await client.getOrCreateDefaultService();

      expect(service).to.eql(newService);
      expect(client.listServices).to.have.been.calledOnce;
      expect(createService).to.have.been.calledOnce;
      expect(createService).to.have.been.calledWith(ServerlessClient.NewService);
    });
  });
});
