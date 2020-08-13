import { logger } from 'flex-dev-utils';
import { Plugin } from '../config/devServer/pluginServer';

/**
 * Error message for when a remote plugin is not found
 *
 * @param name  name of the plugin
 * @param remotePlugins array of remote plugins
 */
export default (notFoundPlugins: string[], remotePlugins: Plugin[]) => {
    logger.clearTerminal();
    logger.error('Server not loading because these plugins were not found remotely:');

    for (const plugin of notFoundPlugins) {
        logger.error('\t', logger.colors.bold(plugin));
    }

    logger.newline();
    logger.error('Your remote plugins are:');

    for (const plugin of remotePlugins) {
        logger.error('\t', logger.colors.bold(plugin.name));
    }

    logger.newline();
};
