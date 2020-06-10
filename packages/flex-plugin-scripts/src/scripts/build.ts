import { env, logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import webpack, { Compiler } from 'webpack';



import getConfiguration, { ConfigurationType } from '../config';
import { setEnvironment } from '../index';
import { buildFailure, buildSuccessful } from '../prints';
import { Callback } from '../types';
import run, { exit } from '../utils/run';


interface BuildBundle {
  warnings?: string[];
  bundles: Bundle[];
}


export interface Bundle {
  chunks?: (number | string)[];
  chunkNames?: string[];
  emitted?: boolean;
  isOverSizeLimit?: boolean;
  name: string;
  size: number;
}


/**
 * Builds the JS and Sourcemap bundles
 * @private
 */
export const _handler = (resolve: Callback<BuildBundle>, reject: Callback<any>): Compiler.Handler => (err, stats) => {
  if (err) {
    return reject(err);
  }

  const result = stats.toJson({ all: false, warnings: true, errors: true });
  if (stats.hasErrors()) {
    return reject(result.errors);
  }

  resolve( {
    bundles: stats.toJson({ assets: true }).assets as Bundle[],
    warnings: result.warnings,
  });
};

/**
 * Promisify the webpack runner
 * @private
 */
/* istanbul ignore next */
export const _runWebpack = async (): Promise<BuildBundle> => {
  return new Promise((resolve, reject) => {
    webpack(getConfiguration(ConfigurationType.Webpack, Environment.Production))
      .run(_handler(resolve, reject));
  });
};

/**
 * Builds the bundle
 */
const build = async (...argv: string[]) => {
  setEnvironment(...argv);
  logger.debug('Building Flex plugin bundle');

  addCWDNodeModule();

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


run(build);

export default build;
