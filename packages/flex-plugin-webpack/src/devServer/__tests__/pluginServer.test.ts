import * as fsScript from 'flex-dev-utils/dist/fs';
import { Request, Response } from 'express-serve-static-core';
import { FlexPluginError } from 'flex-dev-utils';

import * as pluginServerScript from '../pluginServer';

jest.mock('flex-dev-utils/dist/logger');

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

    it('should throw error', (done) => {
      try {
        pluginServerScript._getLocalPlugins(3000, ['plugin-unknown']);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(readPluginsJson).toHaveBeenCalledTimes(1);
        expect(e.message).toContain('was not locally found');
        done();
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
          src: 'https://flex.twilio.com/plugins/v1/plugin-version/1.0.0/bundle.js',
          version: '1.0.0',
        },
      ]);
    });

    it('should throw error', (done) => {
      try {
        pluginServerScript._getRemoteVersionedPlugins([badPlugin]);
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('Unexpected plugin name format was provided');
        done();
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
      jest.spyOn(pluginServerScript, '_getRemotePlugins').mockResolvedValue([remotePlugin, remotePlugin2]);
      jest.spyOn(pluginServerScript, '_getRemoteVersionedPlugins').mockReturnValue([versionPlugin]);
      jest.spyOn(fsScript, 'readPackageJson').mockReturnValue(pkg);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      const plugins = pluginServerScript._mergePlugins([localPlugin], [remotePlugin, remotePlugin2], [versionPlugin]);

      expect(plugins).toHaveLength(3);
      expect(plugins).toEqual([localPlugin, remotePlugin, versionPlugin]);
    });
  });

  describe('_startServer', () => {
    const port = 9000;
    const plugins = {
      local: ['plugin-local1', 'plugin-local2'],
      remote: ['plugin-remote1', 'plugin-remote2'],
      versioned: ['plugin-remote2'],
    };
    const config = { port, remoteAll: true };
    const jweHeaders = { 'x-flex-jwe': 'jweToken' };
    const getReqResp = (method: string, headers: Record<string, string>) => {
      // @ts-ignore
      const resp = {
        writeHead: jest.fn(),
        end: jest.fn(),
      } as Response;
      const req = { method, headers } as Request;

      return { req, resp };
    };
    const onRemotePlugins = jest.fn();

    it('should return 200 for OPTIONS request', async () => {
      const { req, resp } = getReqResp('OPTIONS', {});
      const _getHeaders = jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });

      await pluginServerScript._startServer(plugins, config, onRemotePlugins)(req, resp);

      expect(_getHeaders).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(200, { header: 'true' });
      expect(resp.end).toHaveBeenCalledTimes(1);
    });

    it('should 404 for non GET requests', async () => {
      const { req, resp } = getReqResp('POST', {});
      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });

      await pluginServerScript._startServer(plugins, config, onRemotePlugins)(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(404, { header: 'true' });
      expect(resp.end).toHaveBeenCalledTimes(1);
    });

    it('should 400 if no jwe token is provided', async () => {
      const { req, resp } = getReqResp('GET', {});
      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });

      await pluginServerScript._startServer(plugins, config, onRemotePlugins)(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(400, { header: 'true' });
      expect(resp.end).toHaveBeenCalledTimes(1);
    });

    it('should getPlugins and rebase', async (done) => {
      const { req, resp } = getReqResp('GET', jweHeaders);
      const remotePlugin = [{ name: 'plugin-2' }] as pluginServerScript.Plugin[];

      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });
      const _getRemotePlugins = jest.spyOn(pluginServerScript, '_getRemotePlugins').mockResolvedValue(remotePlugin);
      const _getRemoteVersionedPlugins = jest
        .spyOn(pluginServerScript, '_getRemoteVersionedPlugins')
        .mockReturnValue([]);
      const _mergePlugins = jest
        .spyOn(pluginServerScript, '_mergePlugins')
        .mockReturnValue([{ name: 'plugin-1' }, { name: 'plugin-2' }] as pluginServerScript.Plugin[]);
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'plugin-1', dir: pluginDir }] });

      await pluginServerScript._startServer(plugins, config, onRemotePlugins)(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(200, { header: 'true' });
      expect(_getRemotePlugins).toHaveBeenCalledTimes(1);
      expect(_getRemotePlugins).toHaveBeenCalledWith('jweToken', undefined);
      expect(_getRemoteVersionedPlugins).toHaveBeenCalledTimes(1);
      expect(_getRemoteVersionedPlugins).toHaveBeenCalledWith(plugins.versioned);
      expect(_mergePlugins).toHaveBeenCalledTimes(1);
      expect(onRemotePlugins).toHaveBeenCalledTimes(1);
      expect(onRemotePlugins).toHaveBeenCalledWith(remotePlugin);
      expect(resp.end).toHaveBeenCalledTimes(1);
      expect(resp.end).toHaveBeenCalledWith('[{"name":"plugin-1"},{"name":"plugin-2"}]');

      done();
    });

    it('should fail', async () => {
      const { req, resp } = getReqResp('GET', jweHeaders);

      jest.spyOn(pluginServerScript, '_getHeaders').mockReturnValue({ header: 'true' });
      const _getRemotePlugins = jest.spyOn(pluginServerScript, '_getRemotePlugins').mockRejectedValue('failed-message');
      const _mergePlugins = jest.spyOn(pluginServerScript, '_mergePlugins');
      jest.spyOn(fsScript, 'readPluginsJson').mockReturnValue({ plugins: [{ name: 'test-name', dir: pluginDir }] });

      await pluginServerScript._startServer(plugins, config, onRemotePlugins)(req, resp);

      expect(resp.writeHead).toHaveBeenCalledTimes(1);
      expect(resp.writeHead).toHaveBeenCalledWith(500, { header: 'true' });
      expect(_getRemotePlugins).toHaveBeenCalledTimes(1);
      expect(_getRemotePlugins).toHaveBeenCalledWith('jweToken', undefined);
      expect(_mergePlugins).not.toHaveBeenCalled();
      expect(resp.end).toHaveBeenCalledTimes(1);
      expect(resp.end).toHaveBeenCalledWith('failed-message');
    });
  });
});
