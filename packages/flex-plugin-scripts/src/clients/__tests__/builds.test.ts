import { Credential } from '@twilio/flex-dev-utils';

import BuildClient, { BuildData, BuildStatus } from '../builds';
import ServerlessClient from '../serverless-client';

describe('BuildClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth: Credential = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  };

  const deployedBuild = {
    sid: 'ZB00000000000000000000000000000000',
    status: BuildStatus.Completed,
  };

  const baseClient = new ServerlessClient(auth.username, auth.password);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('constructor', () => {
    it('should throw error if invalid sid is provided', (done) => {
      const sid = 'ZE00000000000000000000000000000000';

      try {
        // eslint-disable-next-line no-new
        new BuildClient(baseClient, sid);
      } catch (e) {
        expect(e.message).toContain('is not of type ZS');
        expect(e.message).toContain(sid);
        done();
      }
    });
  });

  describe('create', () => {
    const failedBuild = {
      sid: 'ZB00000000000000000000000000000001',
      status: BuildStatus.Failed,
    };
    const buildData = {
      Dependencies: { foo: 'bar' },
    } as BuildData;

    it('should create new build', async () => {
      const client = new BuildClient(baseClient, serviceSid);
      // @ts-ignore
      const create = jest.spyOn(client, '_create').mockResolvedValue(deployedBuild);
      // @ts-ignore
      const get = jest.spyOn(client, 'get').mockResolvedValue(deployedBuild);

      const result = await client.create(buildData);

      expect(result).toEqual(deployedBuild);
      expect(create).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(create).toHaveBeenCalledWith(buildData);
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(deployedBuild.sid);

      create.mockRestore();
      get.mockRestore();
    });

    it('should fail to create new build', async () => {
      const client = new BuildClient(baseClient, serviceSid);
      // @ts-ignore
      const create = jest.spyOn(client, '_create').mockResolvedValue(failedBuild);
      // @ts-ignore
      const get = jest.spyOn(client, 'get').mockResolvedValue(failedBuild);

      try {
        await client.create(buildData);
      } catch (e) {
        expect(e).toContain('build has failed');
        expect(create).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(create).toHaveBeenCalledWith(buildData);
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith(failedBuild.sid);
      }

      create.mockRestore();
      get.mockRestore();
    });
  });

  describe('get', () => {
    it('should warn if incorrect sid is provided to remove', async (done) => {
      const client = new BuildClient(baseClient, serviceSid);

      try {
        await client.get(serviceSid);
      } catch (e) {
        expect(e.message).toContain('not of type ZB');
        expect(e.message).toContain(serviceSid);
        done();
      }
    });

    it('should get build', async () => {
      const client = new BuildClient(baseClient, serviceSid);
      // @ts-ignore
      const get = jest.spyOn(client.client, 'get').mockResolvedValue(deployedBuild);

      const result = await client.get(deployedBuild.sid);

      expect(result).toEqual(deployedBuild);
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(`Services/${serviceSid}/Builds/${deployedBuild.sid}`);

      get.mockRestore();
    });
  });

  describe('_create', () => {
    it('should call http.post', async () => {
      const client = new BuildClient(baseClient, serviceSid);
      // @ts-ignore
      const post = jest.spyOn(client.client, 'post').mockReturnThis();

      const data: BuildData = {
        FunctionVersions: [],
        AssetVersions: [],
        Dependencies: {},
      };

      // @ts-ignore
      await client._create(data);
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(expect.any(String), data, expect.anything());
    });
  });
});
