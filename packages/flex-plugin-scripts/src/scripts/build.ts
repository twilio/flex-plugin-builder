import { env, logger } from 'flex-dev-utils';
import { Environment } from 'flex-dev-utils/dist/env';
import { addCWDNodeModule } from 'flex-dev-utils/dist/require';
import webpack from 'webpack';

import getConfiguration, { ConfigurationType } from '../config';
import { buildFailure, buildSuccessful } from '../prints';
import run, { exit } from '../utils/run';

interface BuildBundle {
  warnings?: string[];
  bundles: Bundle[];
}

export interface Bundle {
  chunks: (number | string)[];
  chunkNames: string[];
  emitted: boolean;
  isOverSizeLimit?: boolean;
  name: string;
  size: number;
}

/**
 * Builds the bundle
 */
const build = async (...args: string[]) => {
  logger.debug('Building Flex plugin bundle');

  addCWDNodeModule();

  env.setBabelEnv(Environment.Production);
  env.setNodeEnv(Environment.Production);

  if (!env.isTerminalPersisted()) {
    logger.clearTerminal();
  }
  logger.notice('Compiling a production build...');
  logger.newline();

  try {
    const { warnings, bundles } = await _buildBundle();
    buildSuccessful(bundles, warnings);
    exit(0, args);
  } catch (e) {
    buildFailure(e);
    exit(1, args);
  }
};

export const _buildBundle = async (): Promise<BuildBundle> => {
  return new Promise((resolve, reject) => {
    const config = getConfiguration(ConfigurationType.Webpack, Environment.Production);

    webpack(config)
      .run((err, stats) => {
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
      });
  });
};

run(build);

export default build;
