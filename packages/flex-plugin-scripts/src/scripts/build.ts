import { env, logger, exit, Callback } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { addCWDNodeModule, updateAppVersion } from 'flex-dev-utils/dist/fs';
import { webpack, WebpackCompiler } from 'flex-plugin-webpack';

import getConfiguration, { ConfigurationType } from '../config';
import { setEnvironment } from '..';
import { buildFailure, buildSuccessful } from '../prints';
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

/**
 * Builds the JS and Sourcemap bundles
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
export const _handler = (resolve: Callback<BuildBundle>, reject: Callback<any>): WebpackCompiler.Handler => (
  err,
  stats,
) => {
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
/* istanbul ignore next */
// eslint-disable-next-line import/no-unused-modules
export const _runWebpack = async (): Promise<BuildBundle> => {
  return new Promise((resolve, reject) => {
    webpack(getConfiguration(ConfigurationType.Webpack, Environment.Production)).run(_handler(resolve, reject));
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
