import { logger } from 'flex-dev-utils';
import fs, { readFileSync, readPackageJson } from 'flex-dev-utils/dist/fs';
import { multilineString } from 'flex-dev-utils/dist/strings';
import { join } from 'path';
import http, { IncomingMessage, ServerResponse } from 'http';
import https from 'https';

export interface Plugin {
  src: string;
  name: string;
  enabled: boolean;
  remote?: boolean;
}

/* istanbul ignore next */
const pluginsJsonPath = join(process.cwd(), 'public/plugins.json');
/* istanbul ignore next */
const pluginsServiceConfigPath = join(process.cwd(), 'public', 'pluginsService.js');

/**
 * Returns local plugins from  public/plugins.json
 * @private
 */
/* istanbul ignore next */
export const _getLocalPlugins = () => JSON.parse(readFileSync(pluginsJsonPath)) as Plugin[];

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
export const _getRemotePlugins = async (token: string, version: string): Promise<Plugin[]> => {
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
export const _rebasePlugins = (remotePlugins: Plugin[]) => {
  const pkg = readPackageJson();

  return _getLocalPlugins()
    .map((plugin) => {
      // Local main (plugin) we are running
      if (plugin.name === pkg.name) {
        return plugin;
      }

      // Plugin is disabled - do not load it
      if (!plugin.enabled) {
        return null;
      }

      // Load remote plugin from Flex
      if (plugin.remote === true) {
        return remotePlugins.find((p) => p.name === plugin.name);
      }

      // Backward compatibility / current way of running multiple local plugins
      if (plugin.src) {
        return plugin;
      }

      return null;
    })
    .filter(Boolean);
};

/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param browserPort  the port of browser
 * @private
 */
export const _server = (browserPort: number ) => async (req: IncomingMessage, res: ServerResponse) => {
  const responseHeaders = _getHeaders(browserPort);
  const { headers, method, url } = req;

  if (method === 'OPTIONS') {
    res.writeHead(200, responseHeaders);
    return res.end();
  }
  if (method !== 'GET' || url !== '/plugins') {
    res.writeHead(404, responseHeaders);
    return res.end('Route not found');
  }

  const jweToken = headers['x-flex-jwe'] as string;
  const flexVersion = headers['x-flex-version'] as string;
  if (!jweToken) {
    res.writeHead(400, responseHeaders);
    return res.end('No X-Flex-JWE was provided');
  }

  try {
    const remotePlugins = await _getRemotePlugins(jweToken, flexVersion);
    const plugins = _rebasePlugins(remotePlugins);

    res.writeHead(200, responseHeaders);
    res.end(JSON.stringify(plugins));
  } catch (err) {
    res.writeHead(500, responseHeaders);
    res.end(err);
  }
};

/**
 * Generates the pluginsService.js
 *
 * @param port  the port the local dev-server is running
 * @private
 */
export const _generatePluginServiceConfig = (port: number) => {
  const url = `'http://localhost:${port}/plugins';`;
  const str = multilineString(
    '// This file is auto-generated',
    'if (appConfig.pluginService.url === null) {',
    `  appConfig.pluginService.url = ${url}`,
    '}',
  );

  fs.writeFileSync(pluginsServiceConfigPath, str);
};

/**
 * Runs a local dev-server to proxy requests to Flex plugin service
 * @param browserPort   the port the browser is running
 */
/* istanbul ignore next */
const pluginServer = async (browserPort: string | number) => {
  const port = Number(browserPort);
  _generatePluginServiceConfig(port + 1);

  http
    .createServer(_server(port))
    .listen(port + 1, '127.0.0.1', () => {
      logger.debug(`Local plugin server running on port ${port + 1}`);
    });
};

export default pluginServer;
