import * as fs from 'flex-dev-utils/dist/fs';
import { FlexPluginError } from 'flex-dev-utils';

import * as parserScripts from '../parser';

describe('parser', () => {
  const pluginName = 'plugin-test';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('parseUserInputPlugins', () => {
    const plugin = { name: pluginName, dir: 'test-dir' };
    const readPluginsJson = jest.spyOn(fs, 'readPluginsJson');

    beforeEach(() => {
      readPluginsJson.mockReturnValue({ plugins: [plugin] });
    });

    it('should return the local plugins only if found', () => {
      const result = parserScripts.parseUserInputPlugins(true, ...['--name', pluginName]);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ name: pluginName, remote: false }]);
    });

    it('should always return the remote plugins', () => {
      const result = parserScripts.parseUserInputPlugins(true, ...['--name', 'plugin-test@remote']);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ name: pluginName, remote: true }]);
    });

    it('should always return the versioned plugins', () => {
      const result = parserScripts.parseUserInputPlugins(true, ...['--name', 'plugin-test@1.0.0']);

      expect(readPluginsJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ name: pluginName, remote: true, version: '1.0.0' }]);
    });

    it('should throw an error if the version is not in correct format', (done) => {
      try {
        parserScripts.parseUserInputPlugins(true, ...['--name', 'plugin-test@a.b.c']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain(`The version 'a.b.c' is not a valid semver.`);
        done();
      }
    });

    it('should throw an error if local plugin is not found', (done) => {
      try {
        parserScripts.parseUserInputPlugins(true, ...['--name', 'plugin-unknown']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('No plugin file');
        done();
      }
    });

    it('should throw an error if input is incorrect format', (done) => {
      try {
        parserScripts.parseUserInputPlugins(true, ...['--name', '!']);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('Unexpected plugin name format');
        done();
      }
    });
  });

  describe('findFirstLocalPlugin', () => {
    it('should find no plugin', () => {
      const plugin = {
        name: 'local-plugin',
        remote: true,
      };
      const result = parserScripts.findFirstLocalPlugin([plugin]);

      expect(result).toBeUndefined();
    });
  });
});
