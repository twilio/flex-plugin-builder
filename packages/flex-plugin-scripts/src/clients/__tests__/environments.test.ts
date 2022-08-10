/* eslint-disable camelcase */
import { Credential } from '@twilio/flex-dev-utils';
import * as fsScripts from '@twilio/flex-dev-utils/dist/fs';
import * as random from '@twilio/flex-dev-utils/dist/random';

import EnvironmentClient from '../environments';
import ServerlessClient from '../serverless-client';

describe('EnvironmentClient', () => {
  const pluginName = 'plugin-test';
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth: Credential = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  };
  const baseClient = new ServerlessClient(auth.username, auth.password);

  const environmentMatch = {
    sid: 'ZE00000000000000000000000000000000',
    unique_name: pluginName,
    domain_suffix: 'some-suffix',
  };
  const environmentAnother = {
    sid: 'ZE00000000000000000000000000000001',
    unique_name: 'plugin-sample',
    domain_suffix: 'another-suffix',
  };
  const resourceWithMatch = [environmentMatch, environmentAnother];
  const resourceWithNoMatch = [environmentAnother];

  const paths = {
    app: { name: pluginName },
  };

  beforeEach(() => {
    jest.restoreAllMocks();

    // @ts-ignore
    jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
  });

  describe('constructor', () => {
    it('should fail if incorrect serviceSid is provided', (done) => {
      try {
        // eslint-disable-next-line no-new
        new EnvironmentClient(baseClient, 'ZF00000000000000000000000000000000');
      } catch (e) {
        expect(e.message).toContain('is not of type ZS');
        expect(e.message).toContain('ZF00000000000000000000000000000000');
        done();
      }
    });
  });

  describe('get', () => {
    it('should get and find environment', async () => {
      const client = new EnvironmentClient(baseClient, serviceSid);
      // @ts-ignore
      const list = jest.spyOn(client, 'list').mockResolvedValue(resourceWithMatch);
      const create = jest.spyOn(client, 'create');

      const environment = await client.get();

      expect(environment).toEqual(environmentMatch);
      expect(list).toHaveBeenCalledTimes(1);
      expect(create).not.toHaveBeenCalled();

      list.mockRestore();
      create.mockRestore();
    });

    it('should not find environment, but then create it', async () => {
      const client = new EnvironmentClient(baseClient, serviceSid);
      // @ts-ignore
      const list = jest.spyOn(client, 'list').mockResolvedValue(resourceWithNoMatch);
      // @ts-ignore
      const create = jest.spyOn(client, 'create').mockResolvedValue(environmentAnother);

      const environment = await client.get();

      expect(environment).toEqual(environmentAnother);
      expect(list).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledTimes(1);

      list.mockRestore();
      create.mockRestore();
    });

    it('should not find environment, and throw an exception', async (done) => {
      const client = new EnvironmentClient(baseClient, serviceSid);
      // @ts-ignore
      const list = jest.spyOn(client, 'list').mockResolvedValue(resourceWithNoMatch);
      const create = jest.spyOn(client, 'create');

      try {
        await client.get(false);
      } catch (e) {
        list.mockRestore();
        create.mockRestore();

        done();
      }
    });
  });

  describe('remove', () => {
    it('should warn if incorrect sid is provided to remove', async (done) => {
      const client = new EnvironmentClient(baseClient, serviceSid);

      try {
        await client.remove(serviceSid);
      } catch (e) {
        expect(e.message).toContain('not of type ZE');
        done();
      }
    });

    it('should remove', async () => {
      const sid = 'ZE00000000000000000000000000000000';
      const client = new EnvironmentClient(baseClient, serviceSid);
      // @ts-ignore
      const del = jest.spyOn(client.http, 'delete').mockResolvedValue(environmentMatch);

      await client.remove(sid);
      expect(del).toHaveBeenCalledTimes(1);
      expect(del).toHaveBeenCalledWith(`Services/${serviceSid}/Environments/${sid}`);
    });
  });

  describe('create', () => {
    it('should check create method', async () => {
      const client = new EnvironmentClient(baseClient, serviceSid);
      const randomString = jest.spyOn(random, 'randomString').mockReturnValue('foo');
      // @ts-ignore
      const post = jest.spyOn(client.http, 'post').mockResolvedValue(environmentMatch);
      // @ts-ignore
      const list = jest.spyOn(client, 'list').mockResolvedValue([environmentMatch, environmentAnother]);

      const environment = await client.create();

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(`Services/${serviceSid}/Environments`, {
        UniqueName: pluginName,
        DomainSuffix: 'foo',
      });
      expect(randomString).toHaveBeenCalledTimes(1);
      expect(randomString).toHaveBeenCalledWith(5, [environmentMatch.domain_suffix, environmentAnother.domain_suffix]);
      expect(environment).toEqual(environmentMatch);

      post.mockRestore();
      list.mockRestore();
      randomString.mockRestore();
    });
  });

  describe('list', () => {
    it('should list all', async () => {
      const client = new EnvironmentClient(baseClient, serviceSid);
      // @ts-ignore
      const list = jest.spyOn(client.http, 'list').mockResolvedValue({ environments: [environmentMatch] });

      const result = await client.list();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(environmentMatch);
      expect(list).toHaveBeenCalledTimes(1);
      expect(list).toHaveBeenCalledWith(`Services/${serviceSid}/Environments`, 'environments');

      list.mockRestore();
    });
  });
});
