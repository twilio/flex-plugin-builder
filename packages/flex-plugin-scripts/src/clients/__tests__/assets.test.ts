import { Credential } from 'flex-dev-utils';

import AssetClient from '../assets';
import FileClient from '../files';

jest.mock('../files');

describe('AssetClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth = {} as Credential;

  describe('constructor', () => {
    it('should instantiate as an Asset', () => {
      const client = new AssetClient(auth, serviceSid);
      expect(FileClient).toHaveBeenCalledTimes(1);
      expect(FileClient).toHaveBeenCalledWith(auth, 'Assets', serviceSid);
      expect(client).toBeInstanceOf(FileClient);
    });
  });
});
