import { logger } from 'flex-dev-utils';

import { Plugin } from '..';

/**
 * Error message for when a remote plugin is not found
 *
 * @param notFoundPlugins  name of the plugin
 * @param remotePlugins array of remote plugins
 */
export default (notFoundPlugins: string[], remotePlugins: Plugin[]): void => {
  logger.clearTerminal();

  logger.error('Server not loading because these plugins were not found remotely:');
  logger.newline();
  for (const plugin of notFoundPlugins) {
    logger.error('\t', logger.colors.bold(plugin));
  }

  logger.newline();
  logger.error('Your remote plugins are:');
  logger.newline();
  for (const plugin of remotePlugins) {
    logger.info(`\t--**${plugin.name}**..@..**${plugin.version}**--`);
  }

  logger.newline();
};
