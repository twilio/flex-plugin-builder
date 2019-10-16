import { fs } from 'flex-dev-utils';
import { FlexPluginError } from 'flex-dev-utils/dist/errors';

import { _getPortAndUrl, _replacePlugins, _requirePackages } from '../../sub/browser';
import * as browserScript from '../../sub/browser';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/open');

describe('sub/browser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const expectException = (e: Error, msg: string) => {
    expect(e).toBeInstanceOf(FlexPluginError);
    expect(e.message).toContain(msg);
  };

  describe('_getPort', () => {
    const _expectException = (e: Error) => expectException(e, 'local port');

    it('should exit if no url is provided', async (done) => {
      try {
        await browserScript._getPort('');
      } catch (e) {
        _expectException(e);
        done();
      }

    });

    it('should exit if empty url is provided', async (done) => {
      try {
       await browserScript._getPort('');
      } catch (e) {
        _expectException(e);
        done();
      }
    });

    it('should exit if no port is provided', async (done) => {
      try {
        await browserScript._getPort('http://localhost');
      } catch (e) {
        _expectException(e);
        done();
      }
    });

    it('should exit if un-localhost is provided', async (done) => {
      try {
        await browserScript._getPort('http://twilio.com:1234');
      } catch (e) {
        _expectException(e);
        done();
      }
    });

    it('should return port provided', async () => {
      const port1 = await browserScript._getPort('http://localhost:1234');
      const port2 = await browserScript._getPort('https://localhost:1235');

      expect(port1).toEqual('1234');
      expect(port2).toEqual('1235');
    });
  });

  describe('_getPortAndUrl', () => {
    const _expectException = (e: Error) => expectException(e, 'localhost server');

    it('should exit if no argument is provided', (done) => {
      try {
        browserScript._getPortAndUrl();
      } catch (e) {
        _expectException(e);
        done();
      }

    });

    it('should exit if empty string is provided', (done) => {
      try {
        browserScript._getPortAndUrl('');
      } catch (e) {
        _expectException(e);
        done();
      }

    });

    it('should exit if invalid string is provided', (done) => {
      try {
        browserScript._getPortAndUrl('https://twilio.com');
      } catch (e) {
        _expectException(e);
        done();
      }
    });

    it('should find url and port', () => {
      const { url, port } = browserScript._getPortAndUrl('http://localhost:1234');

      expect(port).toEqual('1234');
      expect(url).toEqual('http://localhost:1234');
    });
  });

  describe('_replacePlugins', () => {
    it('should replace port', () => {
      const plugins = [{  src: 'http://localhost:1234/plugin-test.js' }];
      const pkg = { name: 'plugin-test' };
      const port = '2345';

      const requirePackages = jest
        .spyOn(browserScript, '_requirePackages')
        .mockReturnValue({ plugins, pkg });

      const writeFileSync = jest
        .spyOn(fs, 'writeFileSync')
        .mockReturnValue();

      browserScript._replacePlugins(port);

      expect(requirePackages).toHaveBeenCalledTimes(1);
      expect(requirePackages)
        .toHaveBeenCalledWith(expect.stringMatching('plugins.json'), expect.stringMatching('package.json'));
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(plugins[0].src.indexOf(port) !== -1).toBeTruthy();

      requirePackages.mockRestore();
      writeFileSync.mockRestore();
    });
  });

  describe('browser', () => {
    it('should call update package and open browser', async () => {
      const url = 'http://localhost:1234';
      const port = '1234';

      const getPortAndUrl = jest
        .spyOn(browserScript, '_getPortAndUrl')
        .mockReturnValue({ url, port });
      const replacePlugins = jest
        .spyOn(browserScript, '_replacePlugins')
        .mockReturnValue();

      await browserScript.default('arg1');

      expect(getPortAndUrl).toHaveBeenCalledTimes(1);
      expect(getPortAndUrl).toHaveBeenCalledWith('arg1');
      expect(replacePlugins).toHaveBeenCalledTimes(1);
      expect(replacePlugins).toHaveBeenCalledWith(port);

      getPortAndUrl.mockRestore();
      replacePlugins.mockRestore();
    });
  });
});
