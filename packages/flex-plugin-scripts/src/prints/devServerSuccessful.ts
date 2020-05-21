import { logger, paths } from 'flex-dev-utils';
import { ServiceUrl } from 'flex-dev-utils/dist/urls';

/**
 * Prints the message when dev-server has successfully compiled
 */
export default (local: ServiceUrl, network: ServiceUrl) => {
  logger.success('Compiled successfully!');
  const pkgName = logger.colors.bold(paths.app.name);

  logger.newline();
  logger.info(`Your plugin ${pkgName} is running in the browser on:`);
  logger.newline();
  logger.info('\t', logger.colors.bold('Local:'), '\t', local.url);
  logger.info('\t', logger.colors.bold('Network:'), '\t', network.url);

  logger.newline();
  logger.info('This is a development build and is not intended to be used for production.');
  logger.info('To create a production build, use either:');
  logger.newline();
  logger.installInfo('npm', 'run build');
  logger.installInfo('npm', 'run deploy');
};
