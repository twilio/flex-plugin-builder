import { logger, env } from 'flex-dev-utils';
import webpackFormatMessages from '@k88/format-webpack-messages';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import typescriptFormatter, { Message as TSFormatterMessage } from '@k88/typescript-compile-error-formatter';
import webpack, { Compiler, Configuration } from 'webpack';
import { FunctionalCallback } from '../global';
import { devServerSuccessful } from '../prints';
import paths from './paths';

export interface ErrorsAndWarnings {
  errors: string[];
  warnings: string[];
}

// invalid stands for `bundle invalidated` and is invoked when files are modified in dev-server.
// It does not imply any errors
const HOOK_BEFORE_COMPILE = 'beforeCompile';
const HOOK_RECOMPILE = 'invalid';
const HOOK_COMPILE_FINISHED = 'done';
const HOOK_AFTER_TS_CHECK = 'afterTypeScriptCheck';



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
    const { local, network } = getLocalAndNetworkUrls(env.getPort());
    let tsMessagesPromise: Promise<ErrorsAndWarnings>;
    let tsMessagesResolver: FunctionalCallback<ErrorsAndWarnings, void>;

    if (paths.isTSProject()) {
      compiler.hooks.beforeCompile.tap(HOOK_BEFORE_COMPILE, () => {
        tsMessagesPromise = new Promise(resolve => {
          tsMessagesResolver = (msgs: ErrorsAndWarnings) => resolve(msgs);
        });
      });

      ForkTsCheckerWebpackPlugin
        .getCompilerHooks(compiler)
        .receive.tap(HOOK_AFTER_TS_CHECK, (diagnostics, lints) => {
          const allMsgs = [...diagnostics, ...lints];
          const format = (msg: TSFormatterMessage) => `${msg.file}\n${typescriptFormatter(msg)}`;

          if (tsMessagesResolver) {
            tsMessagesResolver({
              errors: allMsgs.filter(msg => msg.severity === 'error').map(format),
              warnings: allMsgs
                .filter(msg => msg.severity === 'warning')
                .map(format),
            });
          }
        });
    }

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
      const result = stats.toJson({ all: false, errors: true, warnings: true });

      if (paths.isTSProject() && !stats.hasErrors()) {
        const messages = await tsMessagesPromise;

        // Push ts-compile errors into compiler
        result.errors.push(...messages.errors);
        stats.compilation.errors.push(...messages.errors);
        result.warnings.push(...messages.warnings);
        stats.compilation.warnings.push(...messages.warnings);
      }

      const isSuccessful = result.errors.length === 0 && result.warnings.length === 0;
      if (isSuccessful) {
        devServerSuccessful(local, network);
        return;
      }

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
