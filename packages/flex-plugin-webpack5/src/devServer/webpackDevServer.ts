import WebpackDevServer, { ClientConnection, Configuration } from 'webpack-dev-server-wp5';
import { env, logger, open, exit } from '@twilio/flex-dev-utils';
import { getLocalAndNetworkUrls } from '@twilio/flex-dev-utils/dist/urls';

import { Compiler } from '../compiler';
import { WebpackTypeWp5 } from '..';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

/**
 * Starts a {@link WebpackDevServer}
 * @param devCompiler the {@link Compiler} compiler
 * @param devConfig the dev {@link Configuration}
 * @param type the {@link WebpackType}
 */
export default (devCompiler: Compiler, devConfig: Configuration, type: WebpackTypeWp5): void => {
  const port = env.getPort();
  const { local } = getLocalAndNetworkUrls(port);
  const isJavaScriptServer = type === WebpackTypeWp5.JavaScript;
  const isStaticServer = type === WebpackTypeWp5.Static;
  // @ts-ignore
  const devServer = new WebpackDevServer(devConfig, devCompiler);

  if (!isStaticServer) {
    // Show TS errors on browser
    devCompiler.hooks.tsCompiled.tap('afterTSCompile', (warnings, errors) => {
      if (warnings.length) {
        devServer.sendMessage(devServer.webSocketServer?.clients as ClientConnection[], 'warnings', warnings);
      }
      if (errors.length) {
        devServer.sendMessage(devServer.webSocketServer?.clients as ClientConnection[], 'errors', errors);
      }
    });
  }

  // Start the dev-server
  devServer.listen(local.port, local.host, async (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    const serverType = type === WebpackTypeWp5.Complete ? '' : `(${type})`;
    if (isJavaScriptServer) {
      logger.debug('Starting development server %s...', serverType);
    } else {
      logger.clearTerminal();
      logger.notice('Starting development server %s...', serverType);
    }

    if (!isJavaScriptServer) {
      await open(local.url);
    }
  });

  // Close server and exit
  const cleanUp = () => {
    devServer.close();
    exit(0);
  };

  termSignals.forEach((sig) => process.on(sig, cleanUp));
  if (!env.isCI()) {
    process.stdin.on('end', cleanUp);
    process.stdin.resume();
  }
};
