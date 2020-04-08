import { logger, env } from 'flex-dev-utils';
import webpackFormatMessages from '@k88/format-webpack-messages';
import { getUrls } from 'flex-dev-utils/dist/urls';
import webpack, { Compiler, Configuration } from 'webpack';
import { devServerSuccessful } from '../prints';
import paths from './paths';

// invalid stands for `bundle invalidated` and is invoked when files are modified in dev-server.
// It does not imply any errors
const HOOK_RECOMPILE = 'invalid';
const HOOK_COMPILE_FINISHED = 'done';

/**
 * Creates a webpack
 * @param config
 * @param devServer
 */
export default (config: Configuration, devServer = false): Compiler => {
  logger.debug('Creating a webpack compiler using ', JSON.stringify(config));

  try {
    const compiler = webpack(config);

    // For build, we don't need to tap into any hooks
    if (!devServer) {
      return compiler;
    }
    const { local, network } = getUrls(env.getPort());

    compiler.hooks.invalid.tap(HOOK_RECOMPILE, () => {
      if (!env.isTerminalPersisted()) {
        logger.clearTerminal();
      }

      logger.info('Re-compiling...');
    });

    compiler.hooks.done.tap(HOOK_COMPILE_FINISHED, async stats => {
      if (!env.isTerminalPersisted()) {
        logger.clearTerminal();
      }

      const isSuccessful = !stats.hasErrors() && !stats.hasWarnings();
      if (isSuccessful) {
        devServerSuccessful(local, network);
      } else {
        const result = stats.toJson({ all: false, errors: true, warnings: true });
        const formatted = webpackFormatMessages({
          errors: result.errors,
          warnings: result.warnings,
        });

        // Only show errors if both exist
        if (stats.hasErrors()) {
          // Most errors are duplicate of the same error
          // So only show the first error
          formatted.errors.length = 1;

          logger.error(`Failed to compile plugin ${logger.colors.red.bold(paths.packageName)}.`);
          logger.info(formatted.errors.join('\n'));
          logger.newline();
          return;
        }

        // Show warning messages
        logger.warning(`Compiled plugin ${logger.colors.yellow.bold(paths.packageName)} with warning.`);
        logger.info(formatted.warnings.join('\n'));
        logger.newline();
      }
    });

    return compiler;
  } catch (err) {
    logger.error('Failed to create a webpack compiler.');
    logger.newline();
    logger.info(err.message || err);
    logger.newline();

    process.exit(1);
  }
};
