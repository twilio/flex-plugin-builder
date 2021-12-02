import { TwilioCliError } from 'flex-dev-utils';

import FlexPluginsCreate from '../../../../commands/flex/plugins/create';

describe('Commands/FlexPluginsCreate', () => {
  describe('editArgv', () => {
    it('should do nothing if neither flexui1.0 or flexui2.0 args are passed', () => {
      const result = FlexPluginsCreate.editArgv(['name']);
      expect(result).toEqual(['name']);
    });

    it('should remove flag flexui1.0 if passed', () => {
      const result = FlexPluginsCreate.editArgv(['name', '--flexui1.0']);
      expect(result).toEqual(['name']);
    });

    it('should throw error if both flags are passed', (done) => {
      try {
        FlexPluginsCreate.editArgv(['name', '--flexui1.0', '--flexui2.0']);
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioCliError);
        done();
      }
    });

    it('should remove and then add flexui2 flag if flexui2.0 is passed', () => {
      const result = FlexPluginsCreate.editArgv(['name', '--flexui2.0']);
      expect(result).toEqual(['name', '--flexui2', 'true']);
    });
  });
});
