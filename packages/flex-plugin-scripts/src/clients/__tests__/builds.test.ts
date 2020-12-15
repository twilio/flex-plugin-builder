import { Credential } from 'flex-dev-utils';

import BuildClient, { BuildData } from '../builds';
import { BuildStatus } from '../serverless-types';

describe('BuildClient', () => {
  const auth: Credential = {
    username: 'ACxxx',
    password: 'abc',
  };

  const deployedBuild = {
    sid: 'ZB00000000000000000000000000000000',
    status: BuildStatus.Completed,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('constructor', () => {
    it('should throw error if invalid sid is provided', (done) => {
      const sid = 'ZE00000000000000000000000000000000';

      try {
        // eslint-disable-next-line no-new
        new BuildClient(auth, sid);
      } catch (e) {
        expect(e.message).toContain('not valid');
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
      const client = new BuildClient(auth, 'ZS00000000000000000000000000000000');
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
      const client = new BuildClient(auth, 'ZS00000000000000000000000000000000');
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
      const sid = 'ZS00000000000000000000000000000000';
      const client = new BuildClient(auth, sid);

      try {
        // tslint:disable-next-line
        await client.get(sid);
      } catch (e) {
        expect(e.message).toContain('not of type ZB');
        expect(e.message).toContain(sid);
        done();
      }
    });

    it('should get build', async () => {
      const client = new BuildClient(auth, 'ZS00000000000000000000000000000000');
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(deployedBuild);

      const result = await client.get(deployedBuild.sid);

      expect(result).toEqual(deployedBuild);
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(`${BuildClient.BaseUri}/${deployedBuild.sid}`);

      get.mockRestore();
    });
  });
});
