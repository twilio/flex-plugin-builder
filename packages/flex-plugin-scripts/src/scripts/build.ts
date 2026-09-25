import { env, logger, exit, Callback } from '@twilio/flex-dev-utils';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { addCWDNodeModule, getFileSizeInMB, getPaths, updateAppVersion } from '@twilio/flex-dev-utils/dist/fs';
import { webpack5, Stats } from '@twilio/flex-plugin-webpack5';
import { webpack, WebpackCompiler } from '@twilio/flex-plugin-webpack';

import getConfiguration, { ConfigurationType, getConfigurationForWp5 } from '../config';
import { setEnvironment } from '..';
import { buildFailure, buildSuccessful, fileTooLarge } from '../prints';
import run from '../utils/run';

export interface Bundle {
  chunks?: (number | string)[];
  chunkNames?: string[];
  emitted?: boolean;
  isOverSizeLimit?: boolean;
  name: string;
  size: number;
}

interface BuildBundle {
  warnings?: string[];
  bundles: Bundle[];
}

const MAX_BUILD_SIZE_MB = 10;

/**
 * Webpack 5's Stats schema nests related assets (e.g. a chunk's sourcemap) inside that asset's
 * own `related` array, rather than listing them as independent top-level entries the way
 * Webpack 4 does. Flatten them back into a single list so the printed file count/summary
 * includes every emitted file (e.g. the .map), matching Webpack 4's reporting.
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _flattenAssetsWp5 = (assets: Bundle[]): Bundle[] =>
  assets.flatMap((asset) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const related = ((asset as any).related as Bundle[] | undefined) ?? [];
    return [asset, ...related];
  });

/**
 * Builds the JS and Sourcemap bundles
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _handlerWp5 =
  (resolve: Callback<BuildBundle>, reject: Callback<Error | string | string[]>): any =>
  (err: Error, stats: Stats) => {
    if (err) {
      logger.info(`error`);
      reject(err);
      return;
    }

    const result = stats.toJson({ all: false, warnings: true, errors: true });
    if (stats.hasErrors()) {
      reject(result.errors?.map((e) => e.message) as string[]);
      return;
    }

    resolve({
      bundles: _flattenAssetsWp5(stats.toJson({ assets: true }).assets as Bundle[]),
      warnings: result.warnings?.map((w) => w.message),
    });
  };

export const _handler =
  (resolve: Callback<BuildBundle>, reject: Callback<Error | string | string[]>): WebpackCompiler.Handler =>
  (err: Error, stats) => {
    if (err) {
      reject(err);
      return;
    }

    const result = stats.toJson({ all: false, warnings: true, errors: true });
    if (stats.hasErrors()) {
      reject(result.errors);
      return;
    }

    resolve({
      bundles: stats.toJson({ assets: true }).assets as Bundle[],
      warnings: result.warnings,
    });
  };

/**
 * Promisify the webpack 5 runner
 * @private
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
export const _runWebpack5 = async (): Promise<BuildBundle> => {
  logger.debug('Building Flex plugin bundle in webpack 5');
  return new Promise(async (resolve, reject) => {
    const config = await getConfigurationForWp5(ConfigurationType.Webpack, Environment.Production, false);
    webpack5(config).run(_handlerWp5(resolve, reject));
  });
};

/**
 * Promisify the webpack runner
 * @private
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
export const _runWebpack = async (): Promise<BuildBundle> => {
  return new Promise(async (resolve, reject) => {
    const config = await getConfiguration(ConfigurationType.Webpack, Environment.Production, false);
    webpack(config).run(_handler(resolve, reject));
  });
};

/**
 * Builds the bundle
 */
const build = async (...argv: string[]): Promise<void> => {
  const isWp5 = argv.includes('--wp5');
  setEnvironment(...argv);
  logger.debug('Building Flex plugin bundle');

  const index = argv.indexOf('--version');
  if (index !== -1) {
    updateAppVersion(argv[index + 1]);
  }

  addCWDNodeModule(...argv);

  env.setBabelEnv(Environment.Production);
  env.setNodeEnv(Environment.Production);

  logger.clearTerminal();
  logger.notice('Compiling a production build...');
  logger.newline();

  try {
    const { warnings, bundles } = isWp5 ? await _runWebpack5() : await _runWebpack();
    const bundleSize = getFileSizeInMB(getPaths().app.bundlePath);
    const sourceMapSize = getFileSizeInMB(getPaths().app.sourceMapPath);

    if (bundleSize >= MAX_BUILD_SIZE_MB) {
      fileTooLarge('bundle', bundleSize, MAX_BUILD_SIZE_MB);
      exit(1, argv);
      return;
    }

    if (sourceMapSize >= MAX_BUILD_SIZE_MB) {
      fileTooLarge('sourcemap', bundleSize, MAX_BUILD_SIZE_MB);
      exit(1, argv);
      return;
    }

    buildSuccessful(bundles, warnings);
  } catch (e) {
    buildFailure(e);
    exit(1, argv);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(build);

// eslint-disable-next-line import/no-unused-modules
export default build;
