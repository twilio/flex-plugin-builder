import WebpackDevServer, { Configuration } from 'webpack-dev-server';
import { env, logger, open, exit } from '@twilio/flex-dev-utils';
import { getLocalAndNetworkUrls } from '@twilio/flex-dev-utils/dist/urls';

import { WebpackType } from '..';
import { Compiler } from '../compiler';

const termSignals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];

/**
 * Starts a {@link WebpackDevServer}
 * @param devCompiler the {@link Compiler} compiler
 * @param devConfig the dev {@link Configuration}
 * @param type the {@link WebpackType}
 */
export default (devCompiler: Compiler, devConfig: Configuration, type: WebpackType): void => {
  const port = env.getPort();
  const { local } = getLocalAndNetworkUrls(port);
  const isJavaScriptServer = type === WebpackType.JavaScript;
  const isStaticServer = type === WebpackType.Static;

  const devServer = new WebpackDevServer(devConfig, devCompiler);

  if (!isStaticServer) {
    // Show TS errors on browser
    devCompiler.hooks.tsCompiled.tap('afterTSCompile', (warnings, errors) => {
      if (warnings.length) {
        devServer.sendMessage(devServer.webSocketServer?.clients ?? [], 'warnings', warnings);
      }
      if (errors.length) {
        devServer.sendMessage(devServer.webSocketServer?.clients ?? [], 'errors', errors);
      }
    });
  }

  // Start the dev-server
  devServer.startCallback(async (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    const serverType = type === WebpackType.Complete ? '' : `(${type})`;
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
