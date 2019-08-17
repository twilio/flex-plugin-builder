import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import ServiceClient from '../services';

describe('ServiceClient', () => {
  const auth: AuthConfig = {
    accountSid: 'AC00000000000000000000000000000000',
    authToken: 'abc',
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
  });

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      const baseUrl = ServiceClient.getBaseUrl();

      expect(baseUrl).toEqual('https://serverless.twilio.com/v1');
    });

    it('should get prod baseUrl with custom baseUrl', () => {
      const baseUrl = ServiceClient.getBaseUrl('another');

      expect(baseUrl).toEqual('https://another.twilio.com/v1');
    });

    it('should get dev baseUrl', () => {
      process.env.TWILIO_SERVERLESS_REALM = 'dev';
      const baseUrl = ServiceClient.getBaseUrl();

      expect(baseUrl).toEqual('https://serverless.dev.twilio.com/v1');
    });

    it('should throw error if invalid realm is provided', (done) => {
      try {
        process.env.TWILIO_SERVERLESS_REALM = 'invalid';
        ServiceClient.getBaseUrl();
      } catch (e) {
        done();
      }
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
      expect(post).toHaveBeenCalledWith(ServiceClient.BaseUri, ServiceClient.NewService);
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
      expect(get).toHaveBeenCalledWith(ServiceClient.BaseUri);
      expect(get).toHaveBeenCalledWith(ServiceClient.BaseUri);

      get.mockRestore();
    });
  });
});
