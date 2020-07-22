import { env, logger, FlexPluginError } from 'flex-dev-utils';
import { Request, Response } from 'express-serve-static-core';
import { readPluginsJson } from 'flex-dev-utils/dist/fs';
import { Configuration } from 'webpack-dev-server';
import https from 'https';
import { UserInputPlugin } from '../../scripts/start';
import { isHTTPS } from 'flex-dev-utils/dist/env';

export interface Plugin {
  phase: number;
  name: string;
  src: string;
}

/**
 * Returns local plugins from  cli/plugins.json
 * @private
 */
/* istanbul ignore next */
export const _getLocalPlugins = (inputPlugins: UserInputPlugin[]) => {
  const config = readPluginsJson();
  const protocol = 'http' + (isHTTPS() ? 's' : '') + '://';

  return inputPlugins.map((plugin) => {
    const match = config.plugins.find((p) => p.name === plugin.name);

    if (match) {
      return {
        phase: 3,
        name: plugin.name,
        src: `${protocol}localhost:${match.port}/${plugin.name}.js`,
      };
    }

    throw new FlexPluginError (`The plugin ${plugin.name} was not locally found. Try running \`npm install\` once in the plugin directory and try again.`);
  });
};

/**
 * Generates the response headers
 *
 * @param port  the port the browser will be running on
 * @private
 */
export const _getHeaders = (port: number) => ({
  'Access-Control-Allow-Origin': `http://localhost:${port}`,
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
export const _getRemotePlugins = (token: string, version: string): Promise<Plugin[]> => {
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
 * Merge local and remote plugins
 * @param remotePlugins   the plugins returned from Flex
 * @private
 */
export const _mergePlugins = (localPlugins: Plugin[], remotePlugins: Plugin[]) => {
  const deduped = remotePlugins.filter(r => !localPlugins.some(l => l.name === r.name));
  return [... localPlugins, ...deduped];
};

/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param browserPort  the port of browser
 * @private
 */
export default (options: Configuration, userInputPlugins: UserInputPlugin[], includeAllRemote: boolean) => {
  const responseHeaders = _getHeaders(options.port || 3000);

  return async (req: Request, res: Response) => {
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

    const localInputPlugins = userInputPlugins.filter(p => !p.remote);
    const remoteInputPlugins = userInputPlugins.filter(p => p.remote);
    const hasRemotePlugin = includeAllRemote || userInputPlugins.some(p => p.remote);
    const localPlugins = _getLocalPlugins(localInputPlugins);
    const promise: Promise<Plugin[]> = hasRemotePlugin ? _getRemotePlugins(jweToken, flexVersion) : Promise.resolve([]);

    return promise
      .then(plugins => {
        if (includeAllRemote) {
          return plugins;
        }

        // Filter and only return the ones that are in remoteInputPlugins
        return plugins.filter(r => remoteInputPlugins.some(i => i.name === r.name));
      })
      // rebase will eventually get both local and remote plugins
      .then(remotePlugins => {
        logger.trace('Got remote plugins', remotePlugins);

        res.writeHead(200, responseHeaders);
        res.end(JSON.stringify(_mergePlugins(localPlugins, remotePlugins)));
      })
      .catch(err => {
        res.writeHead(500, responseHeaders);
        res.end(err);
      });
  };
}
