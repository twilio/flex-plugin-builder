import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import * as fs from 'flex-dev-utils/dist/fs';
import * as urlScripts from 'flex-dev-utils/dist/urls';
import * as startScripts from '../start';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/urls');
jest.mock('flex-dev-utils/dist/env');
jest.mock('flex-dev-utils/dist/require');

describe('StartScript', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('default', () => {
    it('should start dev-server', async () => {
      const port = 1234;
      const findPort = jest
        .spyOn(urlScripts, 'findPort')
        .mockResolvedValue(port);
      const getDefaultPort = jest
        .spyOn(urlScripts, 'getDefaultPort')
        .mockReturnValue(port);
      const _startDevServer = jest
        .spyOn(startScripts, '_startDevServer')
        .mockReturnThis();

      process.env.PORT = '2345';
      await startScripts.default();

      expect(findPort).toHaveBeenCalledTimes(1);
      expect(findPort).toHaveBeenCalledWith(port);
      expect(getDefaultPort).toHaveBeenCalledTimes(1);
      expect(getDefaultPort).toHaveBeenCalledWith('2345');
      expect(_startDevServer).toHaveBeenCalledTimes(1);
      expect(_startDevServer).toHaveBeenCalledWith(port);
    });
  });

  describe('_updatePluginsUrl', () => {
    const pkg = { name: 'plugin-test' };
    const port = 2345;

    it('should throw an error if plugin not found', (done) => {
      const plugins = [{
        src: 'broken url',
        name: 'plugin-test',
        enabled: true,
      }];

      const requirePackages = jest
        .spyOn(startScripts, '_requirePackages')
        .mockReturnValue({ plugins, pkg });

      try {
        startScripts._updatePluginsUrl(port);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(requirePackages).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('find plugin');
        done();
      }
    });

    it('should throw an error if it fails to find local port', (done) => {
      const plugins = [{
        src: 'http://twilio.com/plugin-test.js',
        name: 'plugin-test',
        enabled: true,
      }];

      const requirePackages = jest
        .spyOn(startScripts, '_requirePackages')
        .mockReturnValue({ plugins, pkg });

      try {
        startScripts._updatePluginsUrl(port);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(requirePackages).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('local port');
        done();
      }
    });

    it('should update plugins URL', () => {
      const plugins = [{
        src: 'http://localhost:1234/plugin-test.js',
        name: 'plugin-test',
        enabled: true,
      }];

      const requirePackages = jest
        .spyOn(startScripts, '_requirePackages')
        .mockReturnValue({ plugins, pkg });
      const writeFileSync = jest
        .spyOn(fs.default, 'writeFileSync')
        .mockReturnValue();

      startScripts._updatePluginsUrl(port);

      expect(requirePackages).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(plugins[0].src.indexOf(port.toString()) !== -1).toBeTruthy();

      requirePackages.mockRestore();
      writeFileSync.mockRestore();
    });
  });
});
