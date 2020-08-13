import { logger } from 'flex-dev-utils';
import { Plugin } from '../config/devServer/pluginServer';
import { exit } from '../utils/run';

/**
 * Error message for when a remote plugin is not found
 *
 * @param name  name of the plugin
 * @param remotePlugins array of remote plugins
 */
export default (name: string, remotePlugins: Plugin[]) => {
    logger.clearTerminal();
    logger.error('Server not loading because your plugin', logger.colors.bold(`${name}`), 'was not found remotely.');
    logger.error('Your remote plugins are:');

    for (const plugin of remotePlugins) {
        logger.error('\t', logger.colors.bold(plugin.name));
    }

    logger.newline();
    exit(1);
};
