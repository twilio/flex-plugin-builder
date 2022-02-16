import { Logger } from '@twilio/flex-dev-utils';

/**
 * Prints error about incompatibility
 */
const incompatibleVersion = (logger: Logger) => (name: string, version: number | null) => {
  logger.error(`The plugin ${name} version (v${version}) is not compatible with this CLI command.`);
  logger.newline();
  logger.info('Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-install}} to upgrade your plugin.');
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (logger: Logger) => ({
  incompatibleVersion: incompatibleVersion(logger),
});
