/* eslint-disable camelcase */
import { Credential } from '@twilio/flex-dev-utils';

import ConfigurationClient from '../configurations';

describe('ConfigurationClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const anotherSid = 'ZS00000000000000000000000000000001';
  const accountSid = 'AC00000000000000000000000000000000';
  const auth: Credential = {
    username: accountSid,
    password: 'abc',
  };

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should get configuration', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = { account_sid: accountSid, serverless_service_sids: [serviceSid] };
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(config);

      const result = await client.get();

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(ConfigurationClient.BaseUrl);
      expect(result).toEqual(config);
    });
  });

  describe('update', () => {
    it('should update configuration', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const payload = { account_sid: accountSid, serverless_service_sids: [serviceSid] };
      // @ts-ignore
      const post = jest.spyOn(client.http, 'post').mockResolvedValue('updated');

      const result = await client.update(payload);

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(ConfigurationClient.BaseUrl, payload);
      expect(result).toEqual('updated');
    });
  });

  describe('getServiceSids', () => {
    it('should return empty array if key is null', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: null,
        ui_version: '',
      };
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(config);

      const sids = await client.getServiceSids();

      expect(get).toHaveBeenCalledTimes(1);
      expect(sids).toEqual([]);
    });

    it('should return sids', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: [serviceSid],
        ui_version: '',
      };
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(config);

      const sids = await client.getServiceSids();

      expect(get).toHaveBeenCalledTimes(1);
      expect(sids).toEqual([serviceSid]);
    });
  });

  describe('registerSid', () => {
    it('should append sid to existing sids', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: [serviceSid],
        ui_version: '',
        ui_dependencies: {},
      };
      const payload = {
        account_sid: accountSid,
        serverless_service_sids: [serviceSid, anotherSid],
      };
      const updated = {
        ...payload,
        ui_version: '',
        ui_dependencies: {},
      };

      const get = jest.spyOn(client, 'get').mockResolvedValue(config);
      const update = jest.spyOn(client, 'update').mockResolvedValue(updated);

      const result = await client.registerSid(anotherSid);

      expect(get).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(payload);
      expect(result).toEqual(updated);
    });

    it('should add the first sid to null', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: null,
        ui_version: '',
        ui_dependencies: {},
      };
      const payload = {
        account_sid: accountSid,
        serverless_service_sids: [serviceSid],
      };
      const updated = {
        ...payload,
        ui_version: '',
        ui_dependencies: {},
      };

      const get = jest.spyOn(client, 'get').mockResolvedValue(config);
      const update = jest.spyOn(client, 'update').mockResolvedValue(updated);

      const result = await client.registerSid(serviceSid);

      expect(get).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(payload);
      expect(result).toEqual(updated);
    });

    it('should return the original config if sid is already added', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: [serviceSid],
        ui_version: '',
        ui_dependencies: {},
      };

      const get = jest.spyOn(client, 'get').mockResolvedValue(config);
      const update = jest.spyOn(client, 'update').mockResolvedValue(config);

      const result = await client.registerSid(serviceSid);

      expect(get).toHaveBeenCalledTimes(1);
      expect(update).not.toHaveBeenCalled();
      expect(result).toEqual(config);
    });
  });

  describe('getFlexUIVersion', () => {
    it('should get the ui_version field', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: [],
        ui_version: '1.2.3',
        ui_dependencies: {},
      };
      const get = jest.spyOn(client, 'get').mockResolvedValue(config);

      const uiVersion = await client.getFlexUIVersion();

      expect(get).toHaveBeenCalledTimes(1);
      expect(uiVersion).toEqual(config.ui_version);
    });
  });

  describe('getUIDependencies', () => {
    it('should return empty object if no ui_dependencies is set', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: [],
        ui_version: '',
      };

      jest.spyOn(client, 'get').mockResolvedValue(config);
      const dependencies = await client.getUIDependencies();
      expect(dependencies).toEqual({});
    });

    it('should get the ui_dependencies field', async () => {
      const client = new ConfigurationClient(auth.username, auth.password);
      const config = {
        account_sid: accountSid,
        serverless_service_sids: [],
        ui_version: '',
        ui_dependencies: {
          react: '1.2.3',
          'react-dom': '1.2.3',
        },
      };
      const get = jest.spyOn(client, 'get').mockResolvedValue(config);

      const dependencies = await client.getUIDependencies();

      expect(get).toHaveBeenCalledTimes(1);
      expect(dependencies).toEqual(config.ui_dependencies);
    });
  });
});
