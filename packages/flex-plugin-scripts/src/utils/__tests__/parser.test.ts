import * as fs from 'flex-dev-utils/dist/fs';
import * as parserScripts from '../parser';
import { FlexPluginError } from 'flex-dev-utils';

describe('parser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('parseUserInputPlugins', () => {
    const plugin = { name: 'plugin-test', dir: 'test-dir', port: 0 };
    const readPluginsJson = jest
      .spyOn(fs, 'readPluginsJson');

    beforeEach(() => {
      readPluginsJson.mockReturnValue({plugins: [plugin]});
    });

    it('should return the local plugins only if found', () => {
      const result = parserScripts.parseUserInputPlugins(...['--name', 'plugin-test']);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{'name': 'plugin-test', 'remote': false}]);
    });

    it('should always return the remote plugins', () => {
      const result = parserScripts.parseUserInputPlugins(...['--name', 'plugin-test@remote']);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{'name': 'plugin-test', 'remote': true}]);
    });

    it('should throw an error if local plugin is not found', (done) => {
      try {
        parserScripts.parseUserInputPlugins(...['--name', 'plugin-unknown']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('No plugin file');
        done();
      }
    });

    it ('should throw an error if input is incorrect format', (done) => {
      try {
        parserScripts.parseUserInputPlugins(...['--name', '!']);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('Unexpected plugin name format');
        done();
      }
    });
  });
})
