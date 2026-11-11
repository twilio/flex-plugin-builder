import nodeFs from 'fs';
import os from 'os';
import path from 'path';

import * as webpack from 'webpack5';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import * as fs from '@twilio/flex-dev-utils/dist/fs';

import * as webpackConfig from '../webpack.config';
import * as clientVariables from '../clientVariables';
import { WebpackTypeWp5 } from '../..';

jest.mock('@twilio/flex-dev-utils/dist/fs');
jest.mock('webpack5/lib/DefinePlugin');

describe('WebpackConfiguration', () => {
  const isTSProject = jest.fn();
  const hasEnvFile = jest.fn();
  const hasEnvExampleFile = jest.fn();
  const hasEnvDefaultsPath = jest.fn();
  const paths = {
    webpack: {
      nodeModulesDir: 'webpack/node_modules',
    },
    app: {
      name: 'test',
      version: '1.2.3',
      buildDir: 'the/build/dir',
      publicDir: 'the/public/dir',
      isTSProject,
      hasEnvFile,
      hasEnvExampleFile,
      hasEnvDefaultsPath,
    },
    extensions: [],
    scripts: {
      nodeModulesDir: 'the/scripts/node_modules',
    },
    cli: {
      nodeModulesDir: 'cli/node_modules',
    },
  };
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };

    // @ts-ignore
    jest.spyOn(fs, 'getPaths').mockReturnValue(paths);
  });

  describe('default', () => {
    it('should get static config', () => {
      const _getBase = jest.spyOn(webpackConfig, '_getBase').mockReturnThis();
      const _getStaticConfiguration = jest.spyOn(webpackConfig, '_getStaticConfiguration').mockReturnThis();
      const _getJavaScriptConfiguration = jest.spyOn(webpackConfig, '_getJavaScriptConfiguration').mockReturnThis();

      webpackConfig.default(Environment.Development, WebpackTypeWp5.Static);

      expect(_getBase).toHaveBeenCalledTimes(1);
      expect(_getStaticConfiguration).toHaveBeenCalledTimes(1);
      expect(_getJavaScriptConfiguration).not.toHaveBeenCalled();
    });

    it('should get js config', () => {
      const _getBase = jest.spyOn(webpackConfig, '_getBase').mockReturnThis();
      const _getStaticConfiguration = jest.spyOn(webpackConfig, '_getStaticConfiguration').mockReturnThis();
      const _getJavaScriptConfiguration = jest.spyOn(webpackConfig, '_getJavaScriptConfiguration').mockReturnThis();

      webpackConfig.default(Environment.Development, WebpackTypeWp5.JavaScript);

      expect(_getBase).toHaveBeenCalledTimes(1);
      expect(_getStaticConfiguration).not.toHaveBeenCalled();
      expect(_getJavaScriptConfiguration).toHaveBeenCalledTimes(1);
    });

    it('should get all config', () => {
      const _getBase = jest.spyOn(webpackConfig, '_getBase').mockReturnThis();
      const _getStaticConfiguration = jest.spyOn(webpackConfig, '_getStaticConfiguration').mockReturnThis();
      const _getJavaScriptConfiguration = jest.spyOn(webpackConfig, '_getJavaScriptConfiguration').mockReturnThis();

      webpackConfig.default(Environment.Development, WebpackTypeWp5.Complete);

      expect(_getBase).toHaveBeenCalledTimes(1);
      expect(_getStaticConfiguration).toHaveBeenCalledTimes(1);
      expect(_getJavaScriptConfiguration).toHaveBeenCalledTimes(1);
    });
  });

  describe('_getJavaScriptConfiguration', () => {
    it('should test devtool field', () => {
      jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({
        splitChunks: false,
        runtimeChunk: false,
        minimize: false,
        minimizer: [],
      });
      jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const configProd = webpackConfig._getJavaScriptConfiguration({}, Environment.Production);
      const configDev = webpackConfig._getJavaScriptConfiguration({}, Environment.Development);

      expect(configProd.devtool).toEqual('cheap-source-map');
      expect(configDev.devtool).toEqual('source-map');
    });

    it('should keep the development source map under the proxied plugin path', () => {
      jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({
        splitChunks: false,
        runtimeChunk: false,
        minimize: false,
        minimizer: [],
      });
      jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const configProd = webpackConfig._getJavaScriptConfiguration({}, Environment.Production);
      const configDev = webpackConfig._getJavaScriptConfiguration({}, Environment.Development);

      expect(configDev.output?.sourceMapFilename).toEqual(`plugins/${paths.app.name}.js.map`);
      expect(configProd.output?.sourceMapFilename).toEqual(`${paths.app.name}.[contenthash].js.map`);
    });

    it('should get production config', () => {
      const _getJavaScriptEntries = jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      const _getOptimization = jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({
        splitChunks: false,
        runtimeChunk: false,
        minimize: false,
        minimizer: [],
      });
      const _getJSPlugins = jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const config = webpackConfig._getJavaScriptConfiguration({}, Environment.Production);
      const { output } = config;

      expect(output?.path).toEqual(paths.app.buildDir);
      expect(output?.filename).toEqual(`${paths.app.name}.js`);
      expect(output?.publicPath).toEqual('/');
      expect(output?.pathinfo).toEqual(false);
      expect(config.bail).toEqual(true);

      expect(_getJavaScriptEntries).toHaveBeenCalledTimes(1);
      expect(_getOptimization).toHaveBeenCalledTimes(1);
      expect(_getJSPlugins).toHaveBeenCalledTimes(1);
    });

    it('should get development config', () => {
      const _getJavaScriptEntries = jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
      const _getOptimization = jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({
        splitChunks: false,
        runtimeChunk: false,
        minimize: false,
        minimizer: [],
      });
      const _getJSPlugins = jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

      const config = webpackConfig._getJavaScriptConfiguration({}, Environment.Development);
      const { output } = config;

      expect(output?.path).toEqual(paths.app.buildDir);
      expect(output?.filename).toEqual(`plugins/${paths.app.name}.js`);
      expect(output?.publicPath).toEqual('/');
      expect(output?.pathinfo).toEqual(true);
      expect(config.bail).toEqual(false);

      expect(_getJavaScriptEntries).toHaveBeenCalledTimes(1);
      expect(_getOptimization).toHaveBeenCalledTimes(1);
      expect(_getJSPlugins).toHaveBeenCalledTimes(1);
    });
  });

  describe('_getJSScripts', () => {
    it('should return flex-ui only', () => {
      const scripts = webpackConfig._getJSScripts('1.18.0', '', '');

      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toContain('flex-ui');
      expect(scripts[0]).toContain('1.18.0');
      expect(scripts[0]).toContain('twilio-flex.min.js');
    });

    it('should return flex-ui and react/dom', () => {
      const scripts = webpackConfig._getJSScripts('1.19.0', '16.13.1', '16.12.1');

      expect(scripts).toHaveLength(3);
      expect(scripts[0]).toContain('umd/react.development');
      expect(scripts[0]).toContain('16.13.1');
      expect(scripts[1]).toContain('umd/react-dom.development');
      expect(scripts[1]).toContain('16.12.1');
      expect(scripts[2]).toContain('flex-ui');
      expect(scripts[2]).toContain('1.19.0');
      expect(scripts[2]).toContain('twilio-flex.unbundled-react.min.js');
    });

    it('should overwrite flex-ui if --flex-ui-source is provided', () => {
      process.env.FLEX_UI_SRC = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';
      const scripts = webpackConfig._getJSScripts('1.19.0', '16.13.1', '16.12.1');

      expect(scripts).toHaveLength(3);
      expect(scripts[0]).toContain('umd/react.development');
      expect(scripts[0]).toContain('16.13.1');
      expect(scripts[1]).toContain('umd/react-dom.development');
      expect(scripts[1]).toContain('16.12.1');
      expect(scripts[2]).toContain('localhost:8080');
    });

    it('should overwrite flex-ui even if flex-ui is < 1.19.0', () => {
      process.env.FLEX_UI_SRC = 'http://localhost:8080/twilio-flex-ui.dev.browser.js';
      const scripts = webpackConfig._getJSScripts('1.18.0', '', '');

      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toContain('localhost:8080');
    });
  });

  describe('_getBasePlugins', () => {
    const depVersions = {
      '@twilio/flex-plugin': '1.1.0',
      '@twilio/flex-ui': '1.2.0',
      react: '1.3.0',
      'react-dom': '1.4.0',
    };

    const mockGetDependencyVersion = () => {
      jest.spyOn(fs, 'getDependencyVersion').mockImplementation((name) => depVersions[name]);
    };
    const verifyInternalDefinition = () => {
      expect(webpack.DefinePlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          __FPB_PLUGIN_UNIQUE_NAME: `'${paths.app.name}'`,
          __FPB_PLUGIN_VERSION: `'${paths.app.version}'`,
          __FPB_FLEX_PLUGIN_VERSION: `'${depVersions['@twilio/flex-plugin']}'`,
          __FPB_FLEX_UI_VERSION: `'${depVersions['@twilio/flex-ui']}'`,
          __FPB_REACT_VERSION: `'${depVersions.react}'`,
          __FPB_REACT_DOM_VERSION: `'${depVersions['react-dom']}'`,
          __FPB_CRACO_CONFIG_FLEX_PLUGIN_VERSION: `'N/A'`,
        }),
      );
    };

    beforeEach(() => {
      // @ts-ignore
      webpack.DefinePlugin.mockReset();
    });

    it('should call DefinePlugin for internal definitions', () => {
      mockGetDependencyVersion();
      const plugins = webpackConfig._getBasePlugins(Environment.Development);

      expect(webpack.DefinePlugin).toHaveBeenCalledTimes(1);
      verifyInternalDefinition();

      const plugin = plugins.find((p) => p.constructor.name === webpack.DefinePlugin.name);
      expect(plugin).toBeDefined();
    });

    it('should add client variables', () => {
      const variables = {
        sample: 'variable',
        test: 'name',
      };
      mockGetDependencyVersion();
      jest.spyOn(clientVariables, 'getSanitizedProcessEnv').mockReturnValue({ 'process.env': variables });

      const plugins = webpackConfig._getBasePlugins(Environment.Development);

      expect(webpack.DefinePlugin).toHaveBeenCalledTimes(1);
      expect(webpack.DefinePlugin).toHaveBeenCalledWith(
        expect.objectContaining({
          'process.env': variables,
        }),
      );
      verifyInternalDefinition();

      const plugin = plugins.find((p) => p.constructor.name === webpack.DefinePlugin.name);
      expect(plugin).toBeDefined();
    });
  });

  describe('node core polyfills', () => {
    const browserVersions = (): string[] =>
      Object.values(webpackConfig.NODE_POLYFILLS).filter((target): target is string => typeof target === 'string');

    it('should fall back to browser versions of the commonly needed core modules', () => {
      isTSProject.mockReturnValue(false);
      const { fallback } = webpackConfig._getBase(Environment.Development).resolve as webpack.ResolveOptions;

      expect(Object.keys(fallback as Record<string, string>).sort((a, b) => a.localeCompare(b))).toEqual(
        Object.keys(webpackConfig.NODE_POLYFILLS).sort((a, b) => a.localeCompare(b)),
      );
    });

    it('should cover every core module that webpack 4 resolved, so plugins that built on webpack 4 keep building', () => {
      // Taken from running the same imports through both webpack versions (see local-tests/wp5 builtins group)
      const webpack4Modules = [
        'assert',
        'buffer',
        'child_process',
        'constants',
        'crypto',
        'dgram',
        'dns',
        'domain',
        'events',
        'fs',
        'http',
        'https',
        'module',
        'net',
        'os',
        'path',
        'process',
        'punycode',
        'querystring',
        'stream',
        'string_decoder',
        'sys',
        'timers',
        'tls',
        'tty',
        'url',
        'util',
        'vm',
        'zlib',
      ];

      expect(webpack4Modules.filter((m) => !(m in webpackConfig.NODE_POLYFILLS))).toEqual([]);
    });

    it('should give an empty module for modules that have no browser equivalent, like webpack 4 did', () => {
      ['child_process', 'dgram', 'dns', 'fs', 'module', 'net', 'tls'].forEach((name) => {
        expect(webpackConfig.NODE_POLYFILLS[name]).toBe(false);
      });
    });

    it('should use bare module names, which the ModuleScopePlugin accepts, not absolute paths', () => {
      browserVersions().forEach((target) => {
        expect(target.startsWith('/')).toBe(false);
        expect(target).not.toMatch(/^[a-zA-Z]:/);
      });
    });

    it('should have every polyfill installed with this package', () => {
      // A missing dependency would only surface as "Module not found" in a customer's build
      browserVersions().forEach((target) => {
        expect(() => require.resolve(target)).not.toThrow();
      });
    });

    it('should provide Buffer and process only where they are referenced', () => {
      const plugins = webpackConfig._getBasePlugins(Environment.Production);

      expect(plugins.some((p) => p instanceof webpack.ProvidePlugin)).toBe(true);
      expect(webpackConfig.NODE_GLOBALS).toEqual({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
        setImmediate: ['timers-browserify', 'setImmediate'],
        clearImmediate: ['timers-browserify', 'clearImmediate'],
      });
    });

    describe('Node variables that webpack 4 defined', () => {
      it('should define global, __dirname and __filename like webpack 4 did, in every environment', () => {
        jest.spyOn(webpackConfig, '_getJavaScriptEntries').mockReturnValue([]);
        jest.spyOn(webpackConfig, '_getOptimization').mockReturnValue({});
        jest.spyOn(webpackConfig, '_getJSPlugins').mockReturnValue([]);

        [Environment.Development, Environment.Production].forEach((environment) => {
          const { node } = webpackConfig._getJavaScriptConfiguration({}, environment);

          // `false` here is what used to turn all three off
          expect(node).toEqual({ global: true, __dirname: 'mock', __filename: 'mock' });
        });
      });

      it('should keep the globals provided by the polyfills installed', () => {
        // the ProvidePlugin entries must point at packages this package depends on
        Object.values(webpackConfig.NODE_GLOBALS).forEach((target) => {
          const name = (Array.isArray(target) ? target[0] : target).split('/')[0];
          expect(() => require.resolve(`${name}/package.json`)).not.toThrow();
        });
      });
    });

    it.each([Environment.Development, Environment.Production])(
      'should resolve packages whose exports only declare "require" for ES imports in %s',
      (environment) => {
        const { conditionNames } = webpackConfig._getBase(environment).resolve?.byDependency?.esm || {};

        // '...' keeps webpack's own conditions (import, module, ...); 'require' is the last resort for CJS-only packages
        expect(conditionNames).toEqual(['...', 'require']);
      },
    );

    describe('where the polyfill packages are installed', () => {
      // The resolver webpack itself uses, so the test fails the way a customer's build did
      const resolveFrom = async (
        modules: string[],
        request: string,
        context: string = os.tmpdir(),
        alias: Record<string, string | false> = {},
      ): Promise<string | false | undefined> => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const enhancedResolve = require(require.resolve('enhanced-resolve', { paths: [require.resolve('webpack5')] }));
        const resolver = enhancedResolve.ResolverFactory.createResolver({
          fileSystem: new enhancedResolve.CachedInputFileSystem(nodeFs, 4000),
          modules,
          alias,
          fallback: { ...webpackConfig.NODE_POLYFILLS },
          extensions: ['.js'],
          mainFields: ['browser', 'main'],
          conditionNames: ['browser', 'require'],
        });

        return new Promise((resolve, reject) => {
          resolver.resolve({}, context, request, {}, (err: Error | null, result?: string | false) =>
            err ? reject(err) : resolve(result),
          );
        });
      };

      it('should search the folder holding every polyfill package', () => {
        const dirs = webpackConfig._getPolyfillModuleDirs();

        browserVersions().forEach((target) => {
          const installedIn = path.dirname(path.dirname(require.resolve(`${target.split('/')[0]}/package.json`)));
          expect(dirs).toContain(installedIn);
        });
      });

      it('should add those folders to the module lookup of the build', () => {
        isTSProject.mockReturnValue(false);
        const { modules } = webpackConfig._getBase(Environment.Development).resolve as webpack.ResolveOptions;

        expect(modules).toEqual(expect.arrayContaining(webpackConfig._getPolyfillModuleDirs()));
      });

      describe('when an unrelated npm package shares a core module name', () => {
        // e.g. the empty `os` package that sits in the CLI's own node_modules
        let decoyDir: string;

        beforeEach(() => {
          decoyDir = nodeFs.mkdtempSync(path.join(os.tmpdir(), 'decoy-'));
          nodeFs.mkdirSync(path.join(decoyDir, 'os'));
          nodeFs.writeFileSync(path.join(decoyDir, 'os', 'package.json'), '{"name":"os","version":"0.1.2"}');
          nodeFs.writeFileSync(path.join(decoyDir, 'os', 'index.js'), 'module.exports = {};');
        });

        afterEach(() => {
          nodeFs.rmSync(decoyDir, { recursive: true, force: true });
        });

        it('should resolve to the decoy with only a fallback (the bug: webpack 4 never did this)', async () => {
          const result = await resolveFrom([decoyDir, ...webpackConfig._getPolyfillModuleDirs()], 'os');

          expect(result).toContain(path.join('decoy-'));
        });

        it('should resolve to the browser version when aliased, as webpack 4 did', async () => {
          isTSProject.mockReturnValue(false);
          const { alias } = webpackConfig._getBase(Environment.Development).resolve as webpack.ResolveOptions;
          const result = await resolveFrom(
            [decoyDir, ...webpackConfig._getPolyfillModuleDirs()],
            'os',
            undefined,
            alias as Record<string, string | false>,
          );

          expect(result).toContain('os-browserify');
        });
      });

      it('should alias every core module with an exact match so subpath imports like util/ are untouched', () => {
        isTSProject.mockReturnValue(false);
        const { alias } = webpackConfig._getBase(Environment.Development).resolve as webpack.ResolveOptions;

        Object.keys(webpackConfig.NODE_POLYFILLS).forEach((name) => {
          expect(alias).toHaveProperty([`${name}$`]);
          expect(alias).not.toHaveProperty(name);
        });
      });

      it('should never alias to a trailing-slash target, which webpack reads as the aliased name and loops on', () => {
        Object.values(webpackConfig._getPolyfillAliases()).forEach((target) => {
          expect(typeof target === 'string' ? target.endsWith('/') : false).toBe(false);
        });
      });

      it.each(Object.keys(webpackConfig.NODE_POLYFILLS))(
        'should resolve %s through the alias without recursing',
        async (name) => {
          const aliases = webpackConfig._getPolyfillAliases();
          const result = await resolveFrom(webpackConfig._getPolyfillModuleDirs(), name, undefined, aliases);

          // `false` is the empty module
          expect(result === false ? 'empty' : typeof result).toBe(
            webpackConfig.NODE_POLYFILLS[name] === false ? 'empty' : 'string',
          );
        },
      );

      it('should fail to resolve util/ when the package is in none of the searched folders', async () => {
        // This is what broke builds when the packages sat in a folder nobody searched
        await expect(resolveFrom([], 'util')).rejects.toThrow(/Recursion in resolving|Can't resolve/);
      });

      it.each([
        'util',
        'url',
        'assert',
        'string_decoder',
        'querystring',
        'path',
        'process',
        'events',
        'buffer',
        'crypto',
        'http',
        'https',
        'zlib',
        'vm',
        'tty',
        'constants',
        'domain',
        'os',
        'punycode',
        'sys',
      ])('should resolve %s from a plugin that has none of the polyfills installed', async (request) => {
        const result = await resolveFrom(webpackConfig._getPolyfillModuleDirs(), request);

        expect(typeof result).toBe('string');
        expect(result).toContain('node_modules');
      });

      it('should let path-browserify find its own process dependency', async () => {
        // path-browserify requires `process/browser`; with no `process` installed beside it, that failed
        const pathBrowserifyDir = path.dirname(require.resolve('path-browserify/package.json'));
        const result = await resolveFrom(webpackConfig._getPolyfillModuleDirs(), 'process/browser', pathBrowserifyDir);

        expect(result).toContain(`${path.sep}process${path.sep}`);
      });
    });
  });

  describe('_getStaticConfiguration', () => {
    it('should add static plugins', () => {
      jest.spyOn(webpackConfig, '_getStaticPlugins').mockReturnValue([]);
      webpackConfig._getStaticConfiguration({}, Environment.Development);

      expect(webpackConfig._getStaticPlugins).toHaveBeenCalledTimes(1);
      expect(webpackConfig._getStaticPlugins).toHaveBeenCalledWith(Environment.Development);
    });
  });
});
