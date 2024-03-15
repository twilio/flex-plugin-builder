/* eslint-disable camelcase */
import { Credential } from '@twilio/flex-dev-utils';

import ServiceClient from '../services';
import ServerlessClient from '../serverless-client';

describe('ServiceClient', () => {
  const auth: Credential = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  };
  const service = {
    sid: 'ZS00000000000000000000000000000000',
    unique_name: 'default',
  };
  const anotherService = {
    sid: 'ZS00000000000000000000000000000001',
    unique_name: 'default2',
  };
  const baseClient = new ServerlessClient(auth.username, auth.password);

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };

    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should get service by sid', async () => {
      const client = new ServiceClient(baseClient);
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(service);

      const response = await client.get(service.sid);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(expect.stringContaining(service.sid));
      expect(get).toHaveBeenCalledWith(expect.stringContaining(`Services/${service.sid}`));
      expect(response).toEqual(service);
    });
  });

  describe('getDefault', () => {
    it('should find service', async () => {
      const client = new ServiceClient(baseClient);
      const resource = { services: [service, anotherService] };
      // @ts-ignore
      const list = jest.spyOn(client.http, 'list').mockResolvedValue(resource);
      // @ts-ignore
      const create = jest.spyOn(client, 'create').mockResolvedValue(anotherService);

      const result = await client.getDefault();

      expect(list).toHaveBeenCalledTimes(1);
      expect(create).not.toHaveBeenCalled();
      expect(result).toEqual(service);

      list.mockRestore();
      create.mockRestore();
    });

    it('should not find service and instead create a new one', async () => {
      const client = new ServiceClient(baseClient);
      const resource = { services: [anotherService] };
      // @ts-ignore
      const list = jest.spyOn(client.http, 'list').mockResolvedValue(resource);
      // @ts-ignore
      const create = jest.spyOn(client, 'create').mockResolvedValue(anotherService);

      const result = await client.getDefault();

      expect(list).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(anotherService);

      list.mockRestore();
      create.mockRestore();
    });
  });

  describe('create', () => {
    it('should check create method', async () => {
      const client = new ServiceClient(baseClient);
      // @ts-ignore
      const post = jest.spyOn(client.http, 'post').mockResolvedValue(service);

      const newService = await client.create();

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('Services', ServiceClient.NewService);
      expect(newService).toEqual(service);

      post.mockRestore();
    });
  });
});
