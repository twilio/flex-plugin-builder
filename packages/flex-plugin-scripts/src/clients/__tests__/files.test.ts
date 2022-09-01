import { Credential } from '@twilio/flex-dev-utils';

import FileClient from '../files';
import ServerlessClient from '../serverless-client';

describe('FileClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  } as Credential;
  const baseClient = new ServerlessClient(auth.username, auth.password);

  class Test extends FileClient {
    constructor(sid: string) {
      super(baseClient, 'Assets', sid);
    }
  }

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('constructor', () => {
    it('should throw error if invalid sid is provided', (done) => {
      try {
        // eslint-disable-next-line no-new
        new Test('ZB00000000000000000000000000000000');
      } catch (e) {
        expect(e.message).toContain('is not of type ZS');
        expect(e.message).toContain('ZB00000000000000000000000000000000');
        done();
      }
    });

    it('should construct', () => {
      const client = new Test(serviceSid);

      // @ts-ignore
      expect(client.http).toEqual(baseClient);
      // @ts-ignore
      expect(client.serviceSid).toEqual(serviceSid);
      // @ts-ignore
      expect(client.fileType).toEqual('Assets');
    });
  });

  describe('getContentType', () => {
    it('should return javascript', () => {
      // @ts-ignore
      expect(FileClient.getContentType('file.js')).toEqual(FileClient.ContentTypeApplicationJavaScript);
    });

    it('should return json', () => {
      // @ts-ignore
      expect(FileClient.getContentType('file.map')).toEqual(FileClient.ContentTypeApplicationJson);
    });

    it('should return octet-stream', () => {
      // @ts-ignore
      expect(FileClient.getContentType('file.something')).toEqual(FileClient.ContentTypeApplicationOctet);
    });
  });

  describe('create', () => {
    it('should call create', async () => {
      const client = new Test(serviceSid);

      // @ts-ignore
      const post = jest.spyOn(client.http, 'post').mockResolvedValue(null);
      // @ts-ignore
      await client._create('file-name');

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(`Services/${serviceSid}/Assets`, {
        FriendlyName: 'file-name',
      });

      post.mockRestore();
    });
  });
});
