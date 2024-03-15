import { Credential } from '@twilio/flex-dev-utils';

import AssetClient from '../assets';
import ServerlessClient from '../serverless-client';
import FileClient from '../files';

jest.mock('../files');

describe('AssetClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth = {} as Credential;

  describe('constructor', () => {
    it('should instantiate as an Asset', () => {
      const baseClient = new ServerlessClient(auth.username, auth.password);
      const client = new AssetClient(baseClient, serviceSid);
      expect(FileClient).toHaveBeenCalledTimes(1);
      expect(FileClient).toHaveBeenCalledWith(baseClient, 'Assets', serviceSid);
      expect(client).toBeInstanceOf(FileClient);
    });
  });
});
