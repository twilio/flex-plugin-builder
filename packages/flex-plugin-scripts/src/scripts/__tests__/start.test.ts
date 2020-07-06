import { FlexPluginError } from 'flex-dev-utils/dist/errors';
import * as fs from 'flex-dev-utils/dist/fs';
import * as urlScripts from 'flex-dev-utils/dist/urls';
import * as startScripts from '../start';
import { WebpackType } from '../../config';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/fs');
jest.mock('flex-dev-utils/dist/urls');
jest.mock('flex-dev-utils/dist/env');
jest.mock('flex-dev-utils/dist/require');

describe('StartScript', () => {
  const paths = {
    app: {
      pluginsJsonPath: '/plugins/json/path',
      pkgPath: '/plugins/pkg/path',
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
  });

  describe('default', () => {
    const port = 1234;
    const findPort = jest
      .spyOn(urlScripts, 'findPort');
    const getDefaultPort = jest
      .spyOn(urlScripts, 'getDefaultPort');
    const _startDevServer = jest
      .spyOn(startScripts, '_startDevServer');

    const assertTest = (type: WebpackType) => {
      expect(findPort).toHaveBeenCalledTimes(1);
      expect(findPort).toHaveBeenCalledWith(port);
      expect(getDefaultPort).toHaveBeenCalledTimes(1);
      expect(getDefaultPort).toHaveBeenCalledWith(port.toString());
      expect(_startDevServer).toHaveBeenCalledTimes(1);
      expect(_startDevServer).toHaveBeenCalledWith(port, [], type);
    }

    beforeEach(() => {
      findPort.mockResolvedValue(port);
      getDefaultPort.mockReturnValue(port);
      _startDevServer.mockReturnThis();
      process.env.PORT = port.toString();
    });

    it('should start dev-server', async () => {
      await startScripts.default();

      assertTest(WebpackType.Complete);
    });

    it('should start static html page', async () => {
      await startScripts.default('flex');

      assertTest(WebpackType.Static);
    });

    it('should start plugin', async () => {
      await startScripts.default('plugin');

      assertTest(WebpackType.JavaScript);
    });
  });

  describe('_updatePluginsUrl', () => {
    const pkg = { name: 'plugin-test' };
    const port = 2345;

    it('should throw an error if plugin not found', (done) => {
      const plugins = [{
        phase: 3,
        name: 'plugin-test',
        src: 'broken url',
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
        phase: 3,
        name: 'plugin-test',
        src: 'http://twilio.com/plugin-test.js',
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
        phase: 3,
        name: 'plugin-test',
        src: 'http://localhost:1234/plugin-test.js',
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
