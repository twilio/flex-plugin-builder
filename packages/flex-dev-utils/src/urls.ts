import url from 'url';
import net from 'net';

import address from 'address';

import { env } from './env';

export interface ServiceUrl {
  url: string;
  port: number;
  host: string;
}
interface InternalServiceUrls {
  local: ServiceUrl;
  network: ServiceUrl;
}

export const DEFAULT_PORT = 3000;

/**
 * Finds whether the port is available
 *
 * @param port the port to check
 * @private
 */
/* c8 ignore next */
const _findPort = async (port: number) => {
  return new Promise((resolve, reject) => {
    const server = net.createConnection({ port });

    /*
     * If we can connect, port is not free
     * If we cannot connect (i.e. on('error')), then port is free
     */
    server
      .on('connect', () => {
        server.end();
        reject();
      })
      .on('error', () => resolve(port));
  });
};

/**
 * Returns the default port
 * @param port  optional port parameter
 */
export const getDefaultPort = (port?: string): number => {
  if (port) {
    const numeric = parseInt(port, 10);

    if (isNaN(numeric)) {
      return DEFAULT_PORT;
    }

    return numeric;
  }

  return DEFAULT_PORT;
};

/**
 * Finds the first available
 *
 * @param startPort
 */
/* c8 ignore next */
export const findPort = async (startPort: number = 3000): Promise<number> => {
  try {
    await Promise.all([_findPort(startPort)]);
    return startPort;
  } catch (e) {
    return findPort(startPort + 1);
  }
};

/**
 * Returns the local and network urls
 * @param port  the port the server is running on
 */
export const getLocalAndNetworkUrls = (port: number): InternalServiceUrls => {
  const protocol = env.isHTTPS() ? 'https' : 'http';

  const localUrl = url.format({
    protocol,
    port,
    hostname: 'localhost',
    pathname: '/',
  });
  const networkUrl = url.format({
    protocol,
    port,
    hostname: address.ip(),
    pathname: '/',
  });

  return {
    local: {
      url: localUrl,
      port,
      host: '0.0.0.0',
    },
    network: {
      url: networkUrl,
      port,
      host: address.ip(),
    },
  };
};

export default url;
