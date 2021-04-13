import { logger } from 'flex-dev-utils';
import { ServiceUrl } from 'flex-dev-utils/dist/urls';
import { FlexConfigurationPlugin, readPluginsJson } from 'flex-dev-utils/dist/fs';

import { Plugin } from '../devServer/pluginServer';

/**
 * Prints the success message when dev-server compiles
 * @param local     the local port
 * @param network   the local network
 * @param localPlugins  the list of local plugins
 * @param remotePlugins the list of remote plugins
 * @param hasRemote whether remote plugins are running
 */
export default (
  local: ServiceUrl,
  network: ServiceUrl,
  localPlugins: string[],
  remotePlugins: Plugin[],
  hasRemote: boolean,
): void => {
  logger.success('Compiled successfully!');

  logger.newline();
  logger.info(`Your plugin app is running in the browser on:`);
  logger.newline();
  const srcs = [
    ['Local', `!!${local.url}!!`],
    ['Network', `!!${network.url}!!`],
  ];
  logger.columns(srcs, { indent: true });

  if (localPlugins.length) {
    logger.newline();
    logger.info('**Local Plugins:**');
    logger.newline();

    const rows = localPlugins.map((name) => {
      const plugin = readPluginsJson().plugins.find((p) => p.name === name) as FlexConfigurationPlugin;

      return [`${plugin.name}`, `!!${plugin.dir}!!`];
    });
    logger.columns(rows, { indent: true });
  }

  if (hasRemote) {
    logger.newline();
    logger.info('**Remote Plugins:**');
    logger.newline();

    const rows = remotePlugins.length
      ? remotePlugins.map((p) => [`${p.name}..@..${p.version}`, `!!${p.src}!!`])
      : [['Will be displayed when you log into your Flex application']];

    logger.columns(rows, { indent: true });
  }

  logger.newline();
  logger.info('This is a development build and is not intended to be used for production.');
  logger.info('To create a production build, use:');
  logger.newline();
  logger.installInfo('twilio', 'flex:plugins:build');
};
