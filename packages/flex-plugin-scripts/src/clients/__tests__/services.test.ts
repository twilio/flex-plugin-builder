/* eslint-disable camelcase */
import { Credential } from 'flex-dev-utils';

import BaseClient from '../baseClient';
import ServiceClient from '../services';

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

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };

    jest.clearAllMocks();
  });

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      const getBaseUrl = jest.spyOn(BaseClient, 'getBaseUrl');
      const baseUrl = ServiceClient.getBaseUrl();

      expect(baseUrl).toEqual('https://serverless.twilio.com/v1');
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenCalledWith('serverless', 'v1');
    });

    it('should get prod baseUrl with custom baseUrl', () => {
      const getBaseUrl = jest.spyOn(BaseClient, 'getBaseUrl');
      const baseUrl = ServiceClient.getBaseUrl('another');

      expect(baseUrl).toEqual('https://another.twilio.com/v1');
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenCalledWith('another', 'v1');
    });
  });

  describe('get', () => {
    it('should get service by sid', async () => {
      const client = new ServiceClient(auth);
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(service);

      const response = await client.get(service.sid);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(expect.stringContaining(service.sid));
      expect(get).toHaveBeenCalledWith(expect.stringContaining(ServiceClient.BASE_URI));
      expect(response).toEqual(service);
    });
  });

  describe('getDefault', () => {
    it('should find service', async () => {
      const client = new ServiceClient(auth);
      const resource = { services: [service, anotherService] };
      // @ts-ignore
      const list = jest.spyOn(client, 'list').mockResolvedValue(resource);
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
      const client = new ServiceClient(auth);
      const resource = { services: [anotherService] };
      // @ts-ignore
      const list = jest.spyOn(client, 'list').mockResolvedValue(resource);
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
      const client = new ServiceClient(auth);
      // @ts-ignore
      const post = jest.spyOn(client.http, 'post').mockResolvedValue(service);

      const newService = await client.create();

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(ServiceClient.BASE_URI, ServiceClient.NewService);
      expect(newService).toEqual(service);

      post.mockRestore();
    });
  });

  describe('list', () => {
    it('should list all', async () => {
      const client = new ServiceClient(auth);
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue([service]);

      const list = await client.list();

      expect(list).toHaveLength(1);
      expect(list[0]).toEqual(service);
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(ServiceClient.BASE_URI);
      expect(get).toHaveBeenCalledWith(ServiceClient.BASE_URI);

      get.mockRestore();
    });
  });
});
