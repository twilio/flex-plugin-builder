import { logger, FlexPluginError } from 'flex-dev-utils';
import { Request, Response } from 'express-serve-static-core';
import { readFileSync, CLIFlexConfiguration, getPaths, readPluginsJson } from 'flex-dev-utils/dist/fs';
import { Configuration } from 'webpack-dev-server';
import https from 'https';

export interface Plugin {
  phase: number;
  name: string;
  src: string;
}

/**
 * Returns local plugins from  public/plugins.json
 * @private
 */
/* istanbul ignore next */
export const _getLocalPlugins = (names: string[]) => {
  const config = readPluginsJson();

  return names.map((pluginName) => {
    const plugin = config.plugins.find((p) => p.name === pluginName);
    if (plugin) {
      return {phase: 3, name: plugin.name, src: `localhost:${plugin.port}/${plugin.name}`} as Plugin;
    }
    throw new FlexPluginError (`The plugin ${pluginName} was not locally found: `);
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
        res.on('end', () => resolve(JSON.parse(Buffer.concat(data).toString())));
        // res.on('end', () => resolve(JSON.parse(Buffer.concat(data).toString()).filter((plugin: { phase: number; }) => plugin.phase >= 3)));
      })
      .on('error', reject)
      .end();
  });
};

/**
 * Rebase plugins with local plugins
 * @param remotePlugins   the plugins returned from Flex
 * @private
 */
export const _mergePlugins = (remotePlugins: Plugin[], localPlugins: Plugin[], remoteNames: string[]) => {
  localPlugins
    .map((plugin) => {
      // Local main (plugin) we are running
      if (plugin.name === getPaths().app.name) {
        return plugin;
      }

      // Backward compatibility / current way of running multiple local plugins
      if (plugin.src && plugin.phase >= 3) {
        return plugin;
      }

      return null;
    })
    .filter(Boolean);

    if (remoteNames.length > 0) {
      return [...localPlugins, ...remotePlugins.filter(p => p.phase >= 3).filter(n => remoteNames.includes(n.name))];
    }

    return [...localPlugins, ...remotePlugins.filter(p => p.phase >= 3)];
};

/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param browserPort  the port of browser
 * @private
 */
export default (options: Configuration, includeRemote: boolean, names: string[], remoteNames: string[]) => {
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
    logger.debug('GET /plugins')

    const jweToken = headers['x-flex-jwe'] as string;
    const flexVersion = headers['x-flex-version'] as string;
    if (!jweToken) {
      res.writeHead(400, responseHeaders);
      return res.end('No X-Flex-JWE was provided');
    }

    const localPlugins = _getLocalPlugins(names);
    const promise: Promise<Plugin[]> = includeRemote ? _getRemotePlugins(jweToken, flexVersion) : Promise.resolve([]);

    // unnessary w/o --include-remote
    return promise
      // rebase will eventually get both local and remote plugins
      .then(remotePlugins => {
        logger.trace('Got remote plugins', remotePlugins);
        const plugins = _mergePlugins(remotePlugins, localPlugins, remoteNames);

        res.writeHead(200, responseHeaders);
        res.end(JSON.stringify(plugins));
      })
      .catch(err => {
        res.writeHead(500, responseHeaders);
        res.end(err);
      });
    };
}
