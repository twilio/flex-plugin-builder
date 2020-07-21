import { logger } from 'flex-dev-utils';
import { ServiceUrl } from 'flex-dev-utils/dist/urls';
import { WebpackType } from '../config';
import { readPluginsJson } from 'flex-dev-utils/dist/fs';
import { UserInputPlugin } from 'src/scripts/start';

/**
 * Prints the message when dev-server has successfully compiled
 */
export default ((local: ServiceUrl, network: ServiceUrl, type: WebpackType, userInputPlugins: UserInputPlugin[]) => {
  logger.success('Compiled successfully!');

  for (const plugin of userInputPlugins) {
    const pkgName = logger.colors.bold(plugin.name);
    const jsUrl = type === WebpackType.Static || type === WebpackType.Complete ? `${plugin.name}.js` : '';
    const pluginType = plugin.remote ? 'remote' : 'local';

    logger.newline();
    logger.info(`Your ${pluginType} plugin ${pkgName} Javascript bundle is running in the browser on:`);
    logger.newline();
    if (pluginType === 'local') {
      const findPlugin = readPluginsJson().plugins.find((p) => p.name === plugin.name);
      if (findPlugin) {
        logger.info('\t', logger.colors.bold('Local:'), '\t', `localhost:${findPlugin.port}/${jsUrl}`);
      }
    }
    logger.info('\t', logger.colors.bold('Network:'), '\t', `${network.url}${jsUrl}`);
  }

  logger.newline();
  logger.info(`Your plugin app is running in the browser on:`)
  logger.newline();
  logger.info('\t', logger.colors.bold('Local:'), '\t', `${local.url}`);
  logger.info('\t', logger.colors.bold('Network:'), '\t', `${network.url}`);

  logger.newline();
  logger.info('This is a development build and is not intended to be used for production.');
  logger.info('To create a production build, use either:');
  logger.newline();
  logger.installInfo('npm', 'run build');
  logger.installInfo('npm', 'run deploy');
});
