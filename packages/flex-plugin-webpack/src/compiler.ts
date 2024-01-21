/* c8 ignore start */

import { logger, FunctionalCallback } from '@twilio/flex-dev-utils';
import { FlexPluginError } from '@twilio/flex-dev-utils/dist/errors';
import { SyncHook } from 'tapable';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import typescriptFormatter, { Issue } from '@k88/typescript-compile-error-formatter';
import webpack, { Compiler as WebpackCompiler, Configuration } from 'webpack';
import { getCliPaths, getPaths, readRunPluginsJson, writeJSONFile } from '@twilio/flex-dev-utils/dist/fs';
import webpackFormatMessages from '@k88/format-webpack-messages';
import { getLocalAndNetworkUrls } from '@twilio/flex-dev-utils/dist/urls';

import { OnCompileCompletePayload } from './devServer/ipcServer';
import { OnRemotePlugins, Plugin } from './devServer/pluginServer';
import { devServerSuccessful } from './prints';
import CompilerHooks = webpack.compilation.CompilerHooks;
import ToJsonOutput = webpack.Stats.ToJsonOutput;

interface ErrorsAndWarnings {
  errors: string[];
  warnings: string[];
}

interface Hook extends CompilerHooks {
  tsCompiled: SyncHook<string[], string[]>;
}
export interface Compiler extends WebpackCompiler {
  hooks: Hook;
}
type OnCompile = (payload: OnCompileCompletePayload) => void;
interface OnCompileResult {
  [key: string]: ToJsonOutput;
}
interface CompilerRenderer {
  onCompile: OnCompile;
  onRemotePlugins: OnRemotePlugins;
}

// Holds all compilation errors
const results: OnCompileResult = {};

/**
 * Creates a webpack compiler
 *
 * @param config      the Webpack configuration
 * @param devServer   whether to run the devserver or not
 * @param type        the webpack compile type
 * @param localPlugins  the names of plugins to run locally
 */
/* c8 ignore next */
export default (
  config: Configuration,
  devServer: boolean,
  isJavaScriptServer: boolean,
  onCompile: OnCompile,
): Compiler => {
  logger.debug('Creating webpack compiler');

  try {
    const compiler = webpack(config) as Compiler;
    compiler.hooks.tsCompiled = new SyncHook(['warnings', 'errors']);

    // For build, we don't need to tap into any hooks
    if (!devServer) {
      return compiler;
    }
    let tsMessagesPromise: Promise<ErrorsAndWarnings>;
    let tsMessagesResolver: FunctionalCallback<ErrorsAndWarnings, void>;

    if (getPaths().app.isTSProject()) {
      compiler.hooks.beforeCompile.tap('beforeCompile', () => {
        tsMessagesPromise = new Promise((resolve) => {
          tsMessagesResolver = (msgs: ErrorsAndWarnings) => resolve(msgs);
        });
      });

      ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler).receive.tap(
        'afterTSCheck',
        (diagnostics: Issue[], lints: Issue[]) => {
          const allMsgs = [...diagnostics, ...lints];
          const format = (issue: Issue) => `${issue.file}\n${typescriptFormatter(issue)}`;

          if (tsMessagesResolver) {
            tsMessagesResolver({
              errors: allMsgs.filter((msg) => msg.severity === 'error').map(format),
              warnings: allMsgs.filter((msg) => msg.severity === 'warning').map(format),
            });
          }
        },
      );
    }

    // invalid is `bundle invalidated` and is invoked when files are modified in dev-server.
    compiler.hooks.invalid.tap('invalid', () => {
      logger.clearTerminal();
      logger.info(`Re-compiling **${getPaths().app.name}**`);
    });

    compiler.hooks.done.tap('done', async (stats) => {
      const result = stats.toJson({ all: false, errors: true, warnings: true });

      if (getPaths().app.isTSProject() && !stats.hasErrors()) {
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

      const config = readRunPluginsJson();

      // Add the plugin to the loaded plugins configuration file
      if (isJavaScriptServer) {
        config.loadedPlugins.push(getPaths().app.name);
        writeJSONFile(config, getCliPaths().localPluginsJsonPath);
      }

      // Check to see if the plugin is the last bundle to be loaded
      onCompile({
        result,
        appName: getPaths().app.name,
        lastPluginBundle: config.plugins.length === config.loadedPlugins.length,
      });
    });

    return compiler;
  } catch (err) {
    // @ts-ignore
    throw new FlexPluginError(`Failed to create a webpack compiler: ${err.message}`);
  }
};

/**
 * Prints the errors and warnings or a successful message when compilation finishes
 * @param port    the port the server is running on
 * @param localPlugins the local plugins running
 * @param showSuccessMsg    whether to show succecss message or not
 * @param hasRemote         whether there are any remote plugins
 */
export const compilerRenderer = (
  port: number,
  localPlugins: string[],
  showSuccessMsg: boolean,
  hasRemote: boolean,
): CompilerRenderer => {
  const { local, network } = getLocalAndNetworkUrls(port);
  const remotePlugins: Plugin[] = [];
  const serverSuccessful = (list: Plugin[]) => {
    list.forEach((l) => {
      if (!remotePlugins.some((r) => r.name === l.name)) {
        remotePlugins.push(l);
      }
    });

    logger.clearTerminal();
    devServerSuccessful(local, network, localPlugins, remotePlugins, hasRemote);
  };

  return {
    onRemotePlugins: serverSuccessful,
    onCompile: ({ result, appName }) => {
      logger.clearTerminal();
      results[appName] = result;

      const isSuccessful = Object.values(results).every((r) => r.errors.length === 0 && r.warnings.length === 0);
      if (isSuccessful) {
        if (showSuccessMsg) {
          serverSuccessful([]);
        }
        return;
      }

      Object.keys(results).forEach((name) => {
        const formatted = webpackFormatMessages({
          errors: results[name].errors,
          warnings: results[name].warnings,
        });

        // Only show errors if both exist
        if (results[name].errors.length) {
          /*
           * Most errors are duplicate of the same error
           * So only show the first error
           */
          formatted.errors.length = 1;

          logger.error(`Failed to compile plugin ${logger.colors.red.bold(name)}.`);
          logger.info(formatted.errors.join('\n'));
          logger.newline();
          return;
        }

        if (results[name].warnings.length) {
          logger.warning(`Compiled plugin ${logger.colors.yellow.bold(name)} with warning(s).`);
          logger.info(formatted.warnings.join('\n'));
          logger.newline();
        }
      });
    },
  };
};
/* c8 ignore stop */
