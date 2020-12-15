import { Credential } from 'flex-dev-utils';

import FileClient from '../files';
import BaseClient from '../baseClient';

jest.mock('../baseClient');

describe('FileClient', () => {
  const serviceSid = 'ZS00000000000000000000000000000000';
  const auth = {} as Credential;

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
        // eslint-disable-next-line no-new
        new Test('ZSxxx');
      } catch (e) {
        expect(e.message).toContain('not valid');
        expect(e.message).toContain('ZSxxx');
        done();
      }
    });

    it('should instantiate', () => {
      // eslint-disable-next-line no-new
      new Test(serviceSid);
      expect(BaseClient).toHaveBeenCalledTimes(1);
    });
  });
});
