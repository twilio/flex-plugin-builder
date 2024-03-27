import { ConfigurationContext } from 'twilio/lib/rest/flexApi/v1/configuration';
import { HttpClient, TwilioCliError } from '@twilio/flex-dev-utils';

import FlexConfigurationClient from '../../clients/FlexConfigurationClient';

describe('FlexConfigurationClient', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const fetch = jest.fn();
  const auth = {
    username: 'test-username',
    password: 'test-password',
    accountSid,
  };
  const sid0 = 'ZS00000000000000000000000000000000';
  const sid1 = 'ZS00000000000000000000000000000001';
  const sid2 = 'ZS00000000000000000000000000000002';
  const sid3 = 'ZS00000000000000000000000000000003';

  // @ts-ignore
  const twilioClient = { fetch } as ConfigurationContext;
  const client = new FlexConfigurationClient(twilioClient, auth);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('fetch', () => {
    it('calls fetch with serverlessSid already set', async () => {
      const sids = [sid0];

      fetch.mockResolvedValue({ serverlessServiceSids: sids });
      const config = await client.fetch();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(config.serverlessServiceSids).toEqual(sids);
    });

    it('calls fetch with serverlessSid not set', async () => {
      fetch.mockResolvedValue({});
      const config = await client.fetch();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(config.serverlessServiceSids).toEqual([]);
    });
  });

  describe('getServerlessSid', () => {
    it('should return nothing if entry is empty', async () => {
      fetch.mockResolvedValue({});
      const result = await client.getServerlessSid();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should return first entry', async () => {
      fetch.mockResolvedValue({ serverlessServiceSids: [sid1, sid2] });

      const result = await client.getServerlessSid();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sid1);
    });
  });

  describe('registerServerlessSid', () => {
    it('should do nothing if sid is already present', async () => {
      fetch.mockResolvedValue({ serverlessServiceSids: [sid1] });

      // @ts-ignore
      const updateServerlessSids = jest.spyOn(client, 'updateServerlessSids').mockReturnThis();
      await client.registerServerlessSid(sid1);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(updateServerlessSids).not.toHaveBeenCalled();
    });

    it('should register sid', async () => {
      fetch.mockResolvedValue({ serverlessServiceSids: [] });
      // @ts-ignore
      const updateServerlessSids = jest.spyOn(client, 'updateServerlessSids').mockReturnThis();

      await client.registerServerlessSid(sid1);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(updateServerlessSids).toHaveBeenCalledTimes(1);
      expect(updateServerlessSids).toHaveBeenCalledWith([sid1]);
    });
  });

  describe('unregisterServerlessSid', () => {
    it('should do nothing if sid does not exist', async () => {
      fetch.mockResolvedValue({ serverlessServiceSids: [sid1] });

      // @ts-ignore
      const updateServerlessSids = jest.spyOn(client, 'updateServerlessSids').mockReturnThis();

      await client.unregisterServerlessSid(sid2);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(updateServerlessSids).not.toHaveBeenCalled();
    });

    it('should remove sid', async () => {
      fetch.mockResolvedValue({ serverlessServiceSids: [sid1, sid2, sid3] });

      // @ts-ignore
      const updateServerlessSids = jest.spyOn(client, 'updateServerlessSids').mockReturnThis();
      await client.unregisterServerlessSid(sid2);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(updateServerlessSids).toHaveBeenCalledTimes(1);
      expect(updateServerlessSids).toHaveBeenCalledWith([sid1, sid3]);
    });
  });

  describe('updateServerlessSids', () => {
    const auth = {
      username: accountSid,
      password: 'password',
    };

    it('should create update sids', async () => {
      // @ts-ignore
      const baseClient = new HttpClient({ ...FlexConfigurationClient.HttpClientOption, auth });
      // @ts-ignore
      const createHttpClient = jest.spyOn(client, 'createHttpClient').mockReturnValue(baseClient);
      jest.spyOn(baseClient, 'post').mockResolvedValue(null);

      // @ts-ignore
      await client.updateServerlessSids([]);

      expect(createHttpClient).toHaveBeenCalledTimes(1);
      expect(baseClient.post).toHaveBeenCalledTimes(1);
      expect(baseClient.post).toHaveBeenCalledWith('Configuration', {
        // eslint-disable-next-line camelcase
        account_sid: accountSid,
        // eslint-disable-next-line camelcase
        serverless_service_sids: [],
      });

      createHttpClient.mockRestore();
    });

    it('should throw an exception', async () => {
      // @ts-ignore
      const baseClient = new HttpClient({ ...FlexConfigurationClient.HttpClientOption, auth });
      // @ts-ignore
      const createHttpClient = jest.spyOn(client, 'createHttpClient').mockReturnValue(baseClient);
      jest.spyOn(baseClient, 'post').mockRejectedValue(null);

      try {
        // @ts-ignore
        await client.updateServerlessSids([]);
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioCliError);
      }

      createHttpClient.mockRestore();
    });
  });
});
