import { logger } from 'flex-dev-utils';
import { ServiceUrl } from 'flex-dev-utils/dist/urls';

export default (local: ServiceUrl, network: ServiceUrl, plugins: string[]) => {
  logger.success('Compiled successfully!');

  logger.newline();
  logger.info(`Your plugin app is running in the browser on:`)
  logger.newline();
  logger.info('\t', logger.colors.bold('Local:'), '\t', `${local.url}`);
  logger.info('\t', logger.colors.bold('Network:'), '\t', `${network.url}`);

  plugins.forEach(plugin => {
    const name = logger.colors.bold(plugin);

    logger.newline();
    logger.info(`Your plugin ${name} Javascript bundle is running in the browser on:`);
    logger.newline();
    logger.info('\t', logger.colors.bold('Local:'), '\t', `${local.url}plugins/${name}.js`);
    logger.info('\t', logger.colors.bold('Network:'), '\t', `${network.url}plugins/${name}.js`);
  });

  logger.newline();
  logger.info('This is a development build and is not intended to be used for production. ');
  logger.info('To create a production build, use:');
  logger.newline();
  logger.installInfo('twilio', 'flex:plugins:build');
};
