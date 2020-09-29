import { expect } from 'chai';
import { ServiceListInstance } from 'twilio/lib/rest/serverless/v1/service';

import { sinon } from '../framework';
import ServerlessClient from '../../clients/ServerlessClient';

describe('ServerlessClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const pluginName = 'plugin-name';

  const listEnv = sinon.stub();
  const getBuild = sinon.stub();
  const getService = sinon.stub();
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

  // @ts-ignore
  const twilioClient = { get: getService } as ServiceListInstance;
  const client = new ServerlessClient(twilioClient);

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
});
