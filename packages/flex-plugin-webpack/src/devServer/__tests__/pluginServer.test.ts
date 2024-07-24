import https from 'https';
import Stream from 'stream';

import * as fsScript from '@twilio/flex-dev-utils/dist/fs';
import { Request, Response } from 'express-serve-static-core';
import { FlexPluginError } from '@twilio/flex-dev-utils';

import * as pluginServerScript from '../pluginServer';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');

describe('pluginServer', () => {
  const pluginName = 'plugin-test';
  const pluginDir = 'the-dir';
  const defaultPluginName = 'default-plugin';

  const paths = {
    app: {
      name: defaultPluginName,
    },
  };

  const pkg: fsScript.PackageJson = {
    name: defaultPluginName,
    version: '1.2.3',
    dependencies: {},
    devDependencies: {},
  };

  const getReqResp = (
    method: string,
    headers: Record<string, string>,
    cookies: Record<string, string> = {},
    url?: string,
  ) => {
    // @ts-ignore
    const resp = {
      writeHead: jest.fn(),
      end: jest.fn(),
    } as Response;
    const req = {
      method,
      headers,
      cookies,
      url,
    } as Request;
    const next = jest.fn();

    return { req, resp, next };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // @ts-ignore
    jest.spyOn(fsScript, 'getPaths').mockReturnValue(paths);
  });

  describe('_getLocalPlugin', () => {
    const plugin = { name: pluginName, dir: pluginDir };
    jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [plugin] });

    it('should find the plugin', () => {
      expect(pluginServerScript._getLocalPlugin(pluginName)).toEqual(plugin);
    });

    it('should not find the plugin', () => {
      expect(pluginServerScript._getLocalPlugin('unknown')).toBeUndefined();
    });
  });

  describe(' _getLocalPlugins', () => {
    const readPluginsJson = jest
      .spyOn(fsScript, 'readPluginsJson')
      .mockReturnValue({ plugins: [{ name: pluginName, dir: pluginDir }] });

    it('should return the plugin if found', () => {
      const result = pluginServerScript._getLocalPlugins(3000, [pluginName]);
      expect(result).toEqual([
        {
          phase: 3,
          name: pluginName,
          src: `http://localhost:3000/plugins/${pluginName}.js`,
        },
      ]);
    });

    it('should throw error', () => {
      try {
        pluginServerScript._getLocalPlugins(3000, ['plugin-unknown']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('was not locally found');
      }
    });
  });

  describe('_getRemoteVersionedPlugins', () => {
    const plugin = 'plugin-version@1.0.0';
    const badPlugin = '!';

    it('should return the versioned plugin', () => {
      const result = pluginServerScript._getRemoteVersionedPlugins([plugin]);
      expect(result).toEqual([
        {
          phase: 3,
          name: 'plugin-version',
          src: '/plugins/v1/plugin-version/1.0.0/bundle.js',
          version: '1.0.0',
        },
      ]);
    });

    it('should throw error', () => {
      try {
        pluginServerScript._getRemoteVersionedPlugins([badPlugin]);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('Unexpected plugin name format was provided');
      }
    });
  });

  describe('splitTokenToChunks', () => {
    const token = 't'.repeat(4000);

    it('should return splitted tokens', () => {
      const result = pluginServerScript.splitTokenToChunks(token, pluginServerScript.JWE_TOKEN_LIMIT);
      expect(result).toEqual(['t'.repeat(pluginServerScript.JWE_TOKEN_LIMIT), 't'.repeat(100)]);
    });

    it('should throw error', () => {
      try {
        pluginServerScript.splitTokenToChunks(token, -1);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('Token chunks Length must be a positive integer');
      }
    });
  });

  describe('combineJweToken', () => {
    const tokenChunks = {
      'flex-jwe': 't'.repeat(pluginServerScript.JWE_TOKEN_LIMIT),
      'flex-jwe-2': 't'.repeat(100),
    };

    it('should return combined token', () => {
      const result = pluginServerScript.combineJweToken(tokenChunks);
      expect(result).toEqual('t'.repeat(pluginServerScript.JWE_TOKEN_LIMIT + 100));
    });
  });

  describe('_makeRequestToFlex', () => {
    it('should return data returned from Flex', async () => {
      const streamStream = new Stream();
      // @ts-ignore
      const httpSpy = jest.spyOn(https, 'request').mockImplementation((_url, cb) => {
        // @ts-ignore
        // eslint-disable-next-line callback-return
        cb(streamStream);

        streamStream.emit('data', Buffer.from('some'));
        streamStream.emit('data', Buffer.from('-'));
        streamStream.emit('data', Buffer.from('data'));

        streamStream.emit('end');
      });

      const data = await pluginServerScript._makeRequestToFlex('jwe-token', '/dummy-path');

      expect(httpSpy).toHaveBeenCalledWith(
        {
          hostname: 'flex.twilio.com',
          port: 443,
          path: '/dummy-path',
          method: 'GET',
          headers: {
            'X-Flex-JWE': 'jwe-token',
          },
        },
        expect.any(Function),
      );
      expect(data).toBe('some-data');
    });

    it('should error if the request to Flex fails', async () => {
      const streamStream = new Stream();
      // @ts-ignore
      jest.spyOn(https, 'request').mockImplementation((_url, cb) => {
        // @ts-ignore
        // eslint-disable-next-line callback-return
        cb(streamStream);
        streamStream.emit('error', 'some-error');
      });

      try {
        await pluginServerScript._makeRequestToFlex('jwe-token', '/dummy-path');
      } catch (e) {
        expect(e.message).toContain('some-error');
      }
    });
  });

  describe('_mergePlugins', () => {
    it('should return both remote and local plugins', () => {
      const localPlugin = { name: defaultPluginName, phase: 3 } as pluginServerScript.Plugin;
      const remotePluginOne = { name: 'plugin-remote-1', phase: 3 } as pluginServerScript.Plugin;
      const remotePluginTwo = { name: 'plugin-remote-2', phase: 3 } as pluginServerScript.Plugin;

      jest.spyOn(pluginServerScript, '_getLocalPlugins').mockReturnValue([localPlugin]);
      jest.spyOn(fsScript, 'readPackageJson').mockReturnValue(pkg);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      const plugins = pluginServerScript._mergePlugins([localPlugin], [remotePluginOne, remotePluginTwo], []);

      expect(plugins).toHaveLength(3);
    });

    it('should return remote plugins that are not being run locally', () => {
      const localPlugin = { name: 'plugin-1', phase: 3 } as pluginServerScript.Plugin;
      const remotePluginOne = { name: 'plugin-1', phase: 3 } as pluginServerScript.Plugin;
      const remotePluginTwo = { name: 'plugin-2', phase: 3 } as pluginServerScript.Plugin;

      jest.spyOn(pluginServerScript, '_getLocalPlugins').mockReturnValue([localPlugin]);
      jest.spyOn(fsScript, 'readPackageJson').mockReturnValue(pkg);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      const plugins = pluginServerScript._mergePlugins([localPlugin], [remotePluginOne, remotePluginTwo], []);

      expect(plugins).toHaveLength(2);
    });

    it('should return remote, version, and local plugins', () => {
      const localPlugin = { name: defaultPluginName, phase: 3 } as pluginServerScript.Plugin;
      const remotePlugin = { name: 'plugin-remote', phase: 3 } as pluginServerScript.Plugin;
      const versionPlugin = { name: 'plugin-version', phase: 3, version: '1.0.0' } as pluginServerScript.Plugin;

      jest.spyOn(pluginServerScript, '_getLocalPlugins').mockReturnValue([localPlugin]);
      jest.spyOn(fsScript, 'readPackageJson').mockReturnValue(pkg);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      const plugins = pluginServerScript._mergePlugins([localPlugin], [remotePlugin], [versionPlugin]);

      expect(plugins).toHaveLength(3);
    });

    it('should return remote plugins that are not local', () => {
      const localPlugin = { name: defaultPluginName, phase: 3 } as pluginServerScript.Plugin;
      const remotePlugin = { name: 'plugin-remote', phase: 3 } as pluginServerScript.Plugin;
      const remotePlugin2 = { name: defaultPluginName, phase: 3 } as pluginServerScript.Plugin;
      const versionPlugin = { name: 'plugin-version', phase: 3, version: '1.0.0' } as pluginServerScript.Plugin;

      jest.spyOn(pluginServerScript, '_getLocalPlugins').mockReturnValue([localPlugin]);
      jest
        .spyOn(pluginServerScript, '_makeRequestToFlex')
        .mockResolvedValue(JSON.stringify([remotePlugin, remotePlugin2]));
      jest.spyOn(pluginServerScript, '_getRemoteVersionedPlugins').mockReturnValue([versionPlugin]);
      jest.spyOn(fsScript, 'readPackageJson').mockReturnValue(pkg);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      const plugins = pluginServerScript._mergePlugins([localPlugin], [remotePlugin, remotePlugin2], [versionPlugin]);

      expect(plugins).toHaveLength(3);
      expect(plugins).toEqual([localPlugin, remotePlugin, versionPlugin]);
    });
  });

  describe('_requestValidator', () => {
    it('should return 200 for OPTIONS request', async () => {
      const { req, resp, next } = getReqResp('OPTIONS', {});
      const _getHeaders = jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });

      await pluginServerScript._requestValidator(req, resp, next);

      expect(_getHeaders).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(200, { header: 'true' });
      expect(resp.end).toHaveBeenCalledTimes(1);
    });

    it('should 404 for non GET requests', async () => {
      const { req, resp, next } = getReqResp('POST', {});
      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });

      await pluginServerScript._requestValidator(req, resp, next);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(404, { header: 'true' });
      expect(resp.end).toHaveBeenCalledTimes(1);
    });

    it('should 400 if no jwe token is provided', async () => {
      const { req, resp, next } = getReqResp('GET', {});
      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });

      await pluginServerScript._requestValidator(req, resp, next);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(400, { header: 'true' });
      expect(resp.end).toHaveBeenCalledTimes(1);
    });
  });

  describe('_renderPluginServer', () => {
    const headers = {};
    const cookies = {
      'flex-jwe': 'jweToken',
    };
    const pluginPath = '/plugin-sample/1.0.0/bundle.js';

    it('should render plugin content', async () => {
      const { req, resp } = getReqResp('GET', headers, cookies, pluginPath);
      const remotePluginContent = 'dummy-source-code-of-the-plugin';

      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });
      const _getPluginContent = jest
        .spyOn(pluginServerScript, '_makeRequestToFlex')
        .mockResolvedValue(remotePluginContent);

      await pluginServerScript._renderPluginServer(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(200, {
        header: 'true',
      });
      expect(_getPluginContent).toHaveBeenCalledTimes(1);
      expect(_getPluginContent).toHaveBeenCalledWith(cookies['flex-jwe'], `/plugins/v1${pluginPath}`);
      expect(resp.end).toHaveBeenCalledTimes(1);
      expect(resp.end).toHaveBeenCalledWith(remotePluginContent);
    });

    it('should 500 in case of errors', async () => {
      const { req, resp } = getReqResp('GET', headers, cookies, pluginPath);

      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });
      const _getPluginContent = jest
        .spyOn(pluginServerScript, '_makeRequestToFlex')
        .mockRejectedValue('failed-message');

      await pluginServerScript._renderPluginServer(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(500, { header: 'true' });
      expect(_getPluginContent).toHaveBeenCalledTimes(1);
      expect(_getPluginContent).toHaveBeenCalledWith(cookies['flex-jwe'], `/plugins/v1${pluginPath}`);
      expect(resp.end).toHaveBeenCalledTimes(1);
      expect(resp.end).toHaveBeenCalledWith('failed-message');
    });
  });

  describe('_fetchPluginsServer', () => {
    const port = 9000;
    const plugins = {
      local: ['plugin-local1', 'plugin-local2'],
      remote: ['plugin-remote1', 'plugin-remote2'],
      versioned: ['plugin-remote2'],
    };
    const config = { port, remoteAll: true };
    const jweHeaders = { 'x-flex-jwe': 'jweToken' };
    const onRemotePlugins = jest.fn();

    it('should getPlugins and rebase', async () => {
      const { req, resp } = getReqResp('GET', jweHeaders);
      const remotePlugin = [{ name: 'plugin-2', phase: 3 }] as pluginServerScript.Plugin[];

      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });
      const _getRemotePlugins = jest
        .spyOn(pluginServerScript, '_makeRequestToFlex')
        .mockResolvedValue(JSON.stringify(remotePlugin));
      const _getRemoteVersionedPlugins = jest
        .spyOn(pluginServerScript, '_getRemoteVersionedPlugins')
        .mockReturnValue([]);
      const _mergePlugins = jest
        .spyOn(pluginServerScript, '_mergePlugins')
        .mockReturnValue([{ name: 'plugin-1' }, { name: 'plugin-2' }] as pluginServerScript.Plugin[]);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'plugin-1', dir: pluginDir }] });

      await pluginServerScript._fetchPluginsServer(plugins, config, onRemotePlugins)(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(200, {
        header: 'true',
        'Set-Cookie': [`flex-jwe=${jweHeaders['x-flex-jwe']}`],
      });
      expect(_getRemotePlugins).toHaveBeenCalledTimes(1);
      expect(_getRemotePlugins).toHaveBeenCalledWith('jweToken', '/plugins', undefined);
      expect(_getRemoteVersionedPlugins).toHaveBeenCalledTimes(1);
      expect(_getRemoteVersionedPlugins).toHaveBeenCalledWith(plugins.versioned);
      expect(_mergePlugins).toHaveBeenCalledTimes(1);
      expect(onRemotePlugins).toHaveBeenCalledTimes(1);
      expect(onRemotePlugins).toHaveBeenCalledWith(remotePlugin);
      expect(resp.end).toHaveBeenCalledTimes(1);
      expect(resp.end).toHaveBeenCalledWith('[{"name":"plugin-1"},{"name":"plugin-2"}]');
    });

    it('should fail', async () => {
      const { req, resp } = getReqResp('GET', jweHeaders);

      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });
      const _getRemotePlugins = jest
        .spyOn(pluginServerScript, '_makeRequestToFlex')
        .mockRejectedValue('failed-message');
      const _mergePlugins = jest.spyOn(pluginServerScript, '_mergePlugins');
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      await pluginServerScript._fetchPluginsServer(plugins, config, onRemotePlugins)(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(500, { header: 'true' });
      expect(_getRemotePlugins).toHaveBeenCalledTimes(1);
      expect(_getRemotePlugins).toHaveBeenCalledWith('jweToken', '/plugins', undefined);
      expect(_mergePlugins).not.toHaveBeenCalled();
      expect(resp.end).toHaveBeenCalledTimes(1);
      expect(resp.end).toHaveBeenCalledWith('failed-message');
    });
  });
});
