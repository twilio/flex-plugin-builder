import { Logger } from 'flex-plugins-utils-logger';

/**
 * Prints error about incompatibility
 */
const incompatibleVersion = (logger: Logger) => (name: string, version: number | null) => {
  logger.error(`The plugin ${name} version (v${version}) is not compatible with this CLI command.`);
  logger.newline();
  logger.info('Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-beta \\-\\-install}} to upgrade your plugin.');
};

export default (logger: Logger) => ({
  incompatibleVersion: incompatibleVersion(logger),
});
