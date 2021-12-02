import { TwilioCliError } from 'flex-dev-utils';

import FlexPluginsCreate from '../../../../commands/flex/plugins/create';

describe('Commands/FlexPluginsCreate', () => {
  describe('checkArgv', () => {
    it('should throw error if both flags are passed', (done) => {
      try {
        FlexPluginsCreate.checkArgv(['name', '--flexui1', '--flexui2']);
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioCliError);
        done();
      }
    });
  });
});
