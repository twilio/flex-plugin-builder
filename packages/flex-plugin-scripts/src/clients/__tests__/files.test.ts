import { Credential } from '@twilio/flex-dev-utils';

import FileClient from '../files';
import ServerlessClient from '../serverless-client';

describe('FileClient', () => {
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
  });
});
