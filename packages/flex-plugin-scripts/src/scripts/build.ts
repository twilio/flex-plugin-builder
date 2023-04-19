import { env, logger, exit, Callback } from '@twilio/flex-dev-utils';
import { Environment } from '@twilio/flex-dev-utils/dist/env';
import { addCWDNodeModule, getFileSizeInMB, getPaths, updateAppVersion } from '@twilio/flex-dev-utils/dist/fs';
import { webpack, WebpackCompiler } from '@twilio/flex-plugin-webpack';

import getConfiguration, { ConfigurationType } from '../config';
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
 * Builds the JS and Sourcemap bundles
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
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
    const { warnings, bundles } = await _runWebpack();
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
