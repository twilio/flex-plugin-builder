import https from 'https';

import { logger, FlexPluginError, exit, env } from 'flex-dev-utils';
import { Request, Response } from 'express-serve-static-core';
import { FlexConfigurationPlugin, readPluginsJson } from 'flex-dev-utils/dist/fs';
import { Configuration } from 'webpack-dev-server';

import { remotePluginNotFound } from '../prints';

export const PLUGIN_INPUT_PARSER_REGEX = /([\w-]+)(?:@(\S+))?/;

export interface Plugin {
  phase: number;
  name: string;
  src: string;
  version?: string;
}

interface StartServerPlugins {
  local: string[];
  remote: string[];
  versioned: string[];
}

interface StartServerConfig {
  port: number;
  remoteAll: boolean;
}

export interface PluginsConfig {
  [pluginName: string]: {
    port: number;
  };
}

export type OnRemotePlugins = (remotePlugins: Plugin[]) => void;

/**
 * Returns the plugin from the local configuration file
 * @param name  the plugin name
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _getLocalPlugin = (name: string): FlexConfigurationPlugin | undefined => {
  return readPluginsJson().plugins.find((p: FlexConfigurationPlugin) => p.name === name);
};

/**
 * Returns local plugins from  cli/plugins.json
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _getLocalPlugins = (port: number, names: string[]): Plugin[] => {
  const protocol = `http${env.isHTTPS() ? 's' : ''}://`;

  return names.map((name) => {
    const match = _getLocalPlugin(name);

    if (match) {
      return {
        phase: 3,
        name,
        src: `${protocol}localhost:${port}/plugins/${name}.js`,
      };
    }

    throw new FlexPluginError(
      `The plugin ${name} was not locally found. Try running \`npm install\` once in the plugin directory and try again.`,
    );
  });
};

/**
 * Generates the response headers
 *
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _getHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type, X-Flex-Version, X-Flex-JWE',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json',
});

/**
 * Fetches the Plugins from Flex
 *
 * @param token     the JWE Token
 * @param version   the Flex version
 */
/* istanbul ignore next */
// eslint-disable-next-line import/no-unused-modules
export const _getRemotePlugins = async (token: string, version: string | null | undefined): Promise<Plugin[]> => {
  return new Promise((resolve, reject) => {
    const headers = {
      'X-Flex-JWE': token,
    };
    if (version) {
      headers['X-Flex-Version'] = version;
    }

    const options = {
      hostname: 'flex.twilio.com',
      port: 443,
      path: '/plugins',
      method: 'GET',
      headers,
    };

    https
      .request(options, (res) => {
        const data: Buffer[] = [];

        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => resolve(JSON.parse(Buffer.concat(data).toString()).filter((p: Plugin) => p.phase >= 3)));
      })
      .on('error', reject)
      .end();
  });
};

/**
 * Returns versioned plugins from the CLI
 *
 * @param names
 * @returns
 */
export const _getRemoteVersionedPlugins = (names: string[]): Plugin[] => {
  return names.map((plugin) => {
    const groups = plugin.match(PLUGIN_INPUT_PARSER_REGEX);

    if (!groups) {
      throw new FlexPluginError('Unexpected plugin name format was provided');
    }

    const name = groups[1];
    const version = groups[2];

    return {
      phase: 3,
      name,
      src: `https://flex.twilio.com/plugins/v1/${name}/${version}/bundle.js`,
      version,
    };
  });
};

/**
 * Merge local and remote plugins
 * @param localPlugins   the list of local plugins
 * @param remotePlugins  the lost of remote plugins
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _mergePlugins = (
  localPlugins: Plugin[],
  remotePlugins: Plugin[],
  versionedPlugins: Plugin[],
): Plugin[] => {
  const deduped = remotePlugins.filter(
    (r) => !localPlugins.some((l) => l.name === r.name) && !versionedPlugins.some((l) => l.name === r.name),
  );

  return [...localPlugins, ...deduped, ...versionedPlugins];
};

/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param plugins
 * @param config
 * @param onRemotePlugin
 */
// eslint-disable-next-line import/no-unused-modules, @typescript-eslint/explicit-module-boundary-types
export const _startServer = (
  plugins: StartServerPlugins,
  config: StartServerConfig,
  onRemotePlugin: OnRemotePlugins,
) => {
  const responseHeaders = _getHeaders();

  return async (req: Request, res: Response): Promise<void> => {
    const { headers, method } = req;

    if (method === 'OPTIONS') {
      res.writeHead(200, responseHeaders);
      return res.end();
    }
    if (method !== 'GET') {
      res.writeHead(404, responseHeaders);
      return res.end('Route not found');
    }
    logger.debug('GET /plugins');

    const jweToken = headers['x-flex-jwe'] as string;
    const flexVersion = headers['x-flex-version'] as string;
    if (!jweToken) {
      res.writeHead(400, responseHeaders);
      return res.end('No X-Flex-JWE was provided');
    }

    const hasRemotePlugin = config.remoteAll || plugins.remote.length !== 0;
    const localPlugins = _getLocalPlugins(config.port, plugins.local);
    const versionedPlugins = _getRemoteVersionedPlugins(plugins.versioned);
    const promise: Promise<Plugin[]> = hasRemotePlugin ? _getRemotePlugins(jweToken, flexVersion) : Promise.resolve([]);

    return (
      promise
        .then((remotePlugins) => {
          if (config.remoteAll) {
            return remotePlugins;
          }

          // Check that all remote plugins inputted are valid
          const notFoundPlugins = plugins.remote.filter((plgin) => !remotePlugins.find((r) => r.name === plgin));
          if (notFoundPlugins.length) {
            remotePluginNotFound(notFoundPlugins, remotePlugins);
            exit(1);
          }

          // Filter and only return the ones that are in remoteInputPlugins
          return remotePlugins.filter((r) => plugins.remote.includes(r.name));
        })
        // rebase will eventually get both local and remote plugins
        .then((remotePlugins) => {
          logger.trace('Got remote plugins', remotePlugins);

          onRemotePlugin([...versionedPlugins, ...remotePlugins]);
          res.writeHead(200, responseHeaders);
          res.end(JSON.stringify(_mergePlugins(localPlugins, remotePlugins, versionedPlugins)));
        })
        .catch((err) => {
          res.writeHead(500, responseHeaders);
          res.end(err);
        })
    );
  };
};

/**
 * Setups up the plugin servers
 * @param plugins
 * @param webpackConfig
 * @param serverConfig
 */
/* istanbul ignore next */
export default (
  plugins: StartServerPlugins,
  webpackConfig: Configuration,
  serverConfig: StartServerConfig,
  onRemotePlugin: OnRemotePlugins,
  pluginsConfig: PluginsConfig,
): void => {
  serverConfig.port = webpackConfig.port || 3000;

  webpackConfig.proxy = plugins.local.reduce((proxy, name) => {
    proxy[`/plugins/${name}.js`] = {
      target: `http://localhost:${serverConfig.port}`, // placeholder
      router: () => {
        const match = pluginsConfig[name];
        if (!match) {
          throw new Error();
        }

        return `http://localhost:${match.port}`;
      },
    };

    return proxy;
  }, {});

  webpackConfig.before = (app, server) => {
    // @ts-ignore
    serverConfig.port = server.options.port || serverConfig.port;
    app.use('^/plugins$', _startServer(plugins, serverConfig, onRemotePlugin));
  };
};
