import https from 'https';
import dns from 'dns';

import { logger, FlexPluginError, exit, env } from '@twilio/flex-dev-utils';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { FlexConfigurationPlugin, readPluginsJson } from '@twilio/flex-dev-utils/dist/fs';
import { Configuration } from 'webpack-dev-server';
import cookieParser from 'cookie-parser';

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
      src: `/plugins/v1/${name}/${version}/bundle.js`,
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
 * Forward the request to Flex to fetch the list of active plugins or render the plugin bundle
 * @param token JWE token
 * @param path Flex endpoint
 * @param version Flex UI Version
 * @returns Data returned by Flex
 * @private
 */
export const _makeRequestToFlex = async (token: string, path: string, version?: string | null): Promise<string> => {
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
      path,
      method: 'GET',
      headers,
    };

    https
      .request(options, (res) => {
        const data: Buffer[] = [];

        res.on('data', (chunk) => data.push(chunk));

        res.on('end', () => {
          resolve(Buffer.concat(data).toString());
        });
      })
      .on('error', reject)
      .end();
  });
};

/**
 * Common middleware that validates the request data
 */
export const _requestValidator = (req: Request, res: Response, next: NextFunction) => {
  const { headers, method } = req;
  // JWE token may be present in headers/cookies
  const jweToken = (headers['x-flex-jwe'] || req.cookies['flex-jwe']) as string;
  const responseHeaders = _getHeaders();

  if (method === 'OPTIONS') {
    res.writeHead(200, responseHeaders);
    res.end();
    return;
  }
  if (method !== 'GET') {
    res.writeHead(404, responseHeaders);
    res.end('Route not found');
    return;
  }

  if (!jweToken) {
    logger.debug('No JWE Token');
    res.writeHead(400, responseHeaders);
    res.end('No X-Flex-JWE was provided');
    return;
  }
  next();
};

/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param plugins
 * @param config
 * @param onRemotePlugin
 */
// eslint-disable-next-line import/no-unused-modules, @typescript-eslint/explicit-module-boundary-types
export const _fetchPluginsServer = (
  plugins: StartServerPlugins,
  config: StartServerConfig,
  onRemotePlugin: OnRemotePlugins,
) => {
  return async (req: Request, res: Response): Promise<void> => {
    const { headers } = req;
    const jweToken = headers['x-flex-jwe'] as string;
    const flexVersion = headers['x-flex-version'] as string;

    const responseHeaders = _getHeaders();

    const hasRemotePlugin = config.remoteAll || plugins.remote.length !== 0;
    const localPlugins = _getLocalPlugins(config.port, plugins.local);
    const versionedPlugins = _getRemoteVersionedPlugins(plugins.versioned);
    const promise: Promise<string> = hasRemotePlugin
      ? _makeRequestToFlex(jweToken, '/plugins', flexVersion)
      : Promise.resolve('[]');

    // eslint-disable-next-line consistent-return
    return (
      promise
        .then((pluginsResponse) => {
          const filteredPlugins = JSON.parse(pluginsResponse).filter((p: Plugin) => p.phase >= 3);
          const pluginsList: Plugin[] = filteredPlugins.map(
            (p: Plugin): Plugin => ({
              ...p,
              // Filter out the Flex endpoint without the base URL (https://flex.twilio.com) if it exists
              src: p.src?.match(/^https.+flex\.twilio\.com(\/.+)$/)?.[1] || p.src,
            }),
          );

          if (config.remoteAll) {
            return pluginsList;
          }

          // Check that all remote plugins inputted are valid
          const notFoundPlugins = plugins.remote.filter((plgin) => !pluginsList.find((r) => r.name === plgin));
          if (notFoundPlugins.length) {
            remotePluginNotFound(notFoundPlugins, pluginsList);
            exit(1);
          }

          // Filter and only return the ones that are in remoteInputPlugins
          return pluginsList.filter((r) => plugins.remote.includes(r.name));
        })
        // rebase will eventually get both local and remote plugins
        .then((remotePlugins) => {
          logger.trace('Got remote plugins', remotePlugins);

          onRemotePlugin([...versionedPlugins, ...remotePlugins]);
          res.writeHead(200, {
            ...responseHeaders,
            /*
             * Set the JWE token in the cookies so that in the subsequent plugin rendering requests
             * dev server can retrieve it to make the request to Flex.
             */
            'Set-Cookie': `flex-jwe=${jweToken}`,
          });
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
 * Basic server to fetch plugin bundle content from Flex and return to the local dev-server
 */
export const _renderPluginServer = async (req: Request, res: Response): Promise<void> => {
  const jweToken = req.cookies['flex-jwe'] as string;
  const responseHeaders = _getHeaders();

  logger.debug(`GET ${req.url}`);

  // eslint-disable-next-line consistent-return
  return _makeRequestToFlex(jweToken, `/plugins/v1${req.url}`)
    .then((pluginContent) => {
      logger.trace('Got remote plugin content', pluginContent);
      res.writeHead(200, responseHeaders);
      res.end(pluginContent);
    })
    .catch((err) => {
      res.writeHead(500, responseHeaders);
      res.end(err);
    });
};

/**
 * Setups up the plugin servers
 * @param plugins
 * @param webpackConfig
 * @param serverConfig
 */
/* c8 ignore next */
export default (
  plugins: StartServerPlugins,
  webpackConfig: Configuration,
  serverConfig: StartServerConfig,
  onRemotePlugin: OnRemotePlugins,
  pluginsConfig: PluginsConfig,
): void => {
  dns.setDefaultResultOrder('ipv4first');
  serverConfig.port = webpackConfig.port || 3000;

  webpackConfig.proxy = plugins.local.reduce((proxy, name) => {
    proxy[`/plugins/${name}.js`] = {
      target: `http://127.0.0.1:${serverConfig.port}`, // placeholder
      router: () => {
        const match = pluginsConfig[name];
        if (!match) {
          throw new Error();
        }

        return `http://127.0.0.1:${match.port}`;
      },
    };

    return proxy;
  }, {});

  webpackConfig.before = (app, server) => {
    // @ts-ignore
    serverConfig.port = server.options.port || serverConfig.port;
    // @ts-ignore
    app.use(cookieParser());
    // @ts-ignore
    app.use('^/plugins$', _requestValidator, _fetchPluginsServer(plugins, serverConfig, onRemotePlugin));
    // @ts-ignore
    app.use('^/plugins/v1/', _requestValidator, _renderPluginServer);
  };
};
