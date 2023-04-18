import { Logger } from '@twilio/flex-dev-utils';

/**
 * Prints error about incompatibility
 */
const incompatibleVersion = (logger: Logger) => (name: string, version: number | null) => {
  logger.error(`The plugin ${name} version (v${version}) is not compatible with this CLI command.`);
  logger.newline();
  logger.info('Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-install}} to upgrade your plugin.');
};

/**
 * Prints warning about new version of OpenSSL in Node v18
 */
const openSSLWarning = (logger: Logger) => () => {
  logger.newline();
  logger.warning(
    'WARNING: If you encounter this error: {{ERR-OSSL-EVP-UNSUPPORTED}}, which happens due to incompatibility between newer version of OpenSSL and Node v18, run the following command:',
  );
  logger.newline();
  logger.info('For MacOS & Linux: Run {{$ export NODE_OPTIONS=\\-\\-openssl-legacy-provider}}');
  logger.newline();
  logger.info('For Windows: Run {{$ set NODE_OPTIONS=\\-\\-openssl-legacy-provider}}');
  logger.newline();
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (logger: Logger) => ({
  incompatibleVersion: incompatibleVersion(logger),
  openSSLWarning: openSSLWarning(logger),
});
