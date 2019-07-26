import { AuthConfig } from 'flex-dev-utils/dist/keytar';

import FileClient from '../files';
import BaseClient from '../baseClient';

jest.mock('../baseClient');

describe('FileClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth = {} as AuthConfig;

  class Test extends FileClient {
    constructor(sid: string) {
      super(auth, 'Assets', sid);
    }
  }

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('constructor', () => {
    it('should throw error if invalid sid is provided', (done) => {
      try {
        // tslint:disable-next-line
        new Test('ZSxxx');
      } catch (e) {
        expect(e.message).toContain('not valid');
        expect(e.message).toContain('ZSxxx');
        done();
      }
    });

    it('should instantiate', () => {
      // tslint:disable-next-line
      new Test(serviceSid);
      expect(BaseClient).toHaveBeenCalledTimes(1);
    });
  });
});
