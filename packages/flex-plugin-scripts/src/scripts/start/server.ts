import net from 'net';

/**
 * Finds the first available two consecutive ports
 *
 * @param startPort
 */
/* istanbul ignore next */
export const findPorts = async (startPort: number = 3000): Promise<number> => {
  try {
    await Promise.all([_findPort(startPort), _findPort(startPort + 1)]);
    return startPort;
  } catch (e) {
    return await findPorts(startPort + 1);
  }
};

/**
 * Finds whether the port is available
 *
 * @param port the port to check
 * @private
 */
/* istanbul ignore next */
const _findPort = (port: number) => {
  return new Promise((resolve, reject) => {
    const server = net.createConnection({ port });

    // If we can connect, port is not free
    // If we cannot connect (i.e. on('error')), then port is free
    server
      .on('connect', () => {
        server.end();
        reject();
      })
      .on('error', () => resolve(port));
  });
};
