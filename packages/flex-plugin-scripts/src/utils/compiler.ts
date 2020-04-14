import { logger, env } from 'flex-dev-utils';
import webpackFormatMessages from '@k88/format-webpack-messages';
import { getLocalAndNetworkUrls } from 'flex-dev-utils/dist/urls';
import { SyncHook } from 'tapable';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import typescriptFormatter, { Issue } from '@k88/typescript-compile-error-formatter';
import webpack, { Compiler as WebpackCompiler, Configuration } from 'webpack';
import { devServerSuccessful } from '../prints';
import paths from './paths';
import CompilerHooks = webpack.compilation.CompilerHooks;

export interface ErrorsAndWarnings {
  errors: string[];
  warnings: string[];
}

interface Hook extends CompilerHooks {
  tsCompiled: SyncHook<string[], string[]>;
}
export interface Compiler extends WebpackCompiler {
  hooks: Hook;
}

export type FunctionalCallback<D, R> = (data: D) => R;

/**
 * Creates a webpack
 * @param config
 * @param devServer
 */
export default (config: Configuration, devServer = false): Compiler => {
  logger.debug('Creating a webpack compiler using ', JSON.stringify(config));

  try {
    const compiler = webpack(config) as Compiler;
    compiler.hooks.tsCompiled = new SyncHook(['warnings', 'errors']);

    // For build, we don't need to tap into any hooks
    if (!devServer) {
      return compiler;
    }
    const { local, network } = getLocalAndNetworkUrls(env.getPort());
    let tsMessagesPromise: Promise<ErrorsAndWarnings>;
    let tsMessagesResolver: FunctionalCallback<ErrorsAndWarnings, void>;

    if (paths.isTSProject()) {
      compiler.hooks.beforeCompile.tap('beforeCompile', () => {
        tsMessagesPromise = new Promise(resolve => {
          tsMessagesResolver = (msgs: ErrorsAndWarnings) => resolve(msgs);
        });
      });

      ForkTsCheckerWebpackPlugin
        .getCompilerHooks(compiler)
        .receive.tap('afterTSCheck', (diagnostics, lints) => {
          const allMsgs = [...diagnostics, ...lints];
          const format = (issue: Issue) => `${issue.file}\n${typescriptFormatter(issue)}`;

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

    // invalid is `bundle invalidated` and is invoked when files are modified in dev-server.
    compiler.hooks.invalid.tap('invalid', () => {
      if (!env.isTerminalPersisted()) {
        logger.clearTerminal();
      }

      logger.info('Re-compiling...');
    });

    compiler.hooks.done.tap('done', async stats => {
      if (!env.isTerminalPersisted()) {
        logger.clearTerminal();
      }
      const result = stats.toJson({ all: false, errors: true, warnings: true });

      if (paths.isTSProject() && !stats.hasErrors()) {
        const delayedMsg = setTimeout(() => {
          logger.notice('Waiting for Typescript check results...');
        }, 100);
        const messages = await tsMessagesPromise;
        clearTimeout(delayedMsg);

        // Push ts-compile errors into compiler
        result.errors.push(...messages.errors);
        stats.compilation.errors.push(...messages.errors);
        result.warnings.push(...messages.warnings);
        stats.compilation.warnings.push(...messages.warnings);

        compiler.hooks.tsCompiled.call(messages.warnings, messages.errors);
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
