import { fs, logger } from 'flex-dev-utils';
import webpack from 'webpack';
import getConfiguration from '../config';
import webpackFactory from '../config/webpack.config';


import run, { exit } from '../utils/run';

/**
 * Builds the bundle
 */
const build = async (...args: string[]) => {
  logger.debug('Building Flex plugin bundle');

  process.env.NODE_ENV = 'production';

  await _buildBundle();
};

export const _buildBundle = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const config = getConfiguration('webpack', 'production');

    webpack(config)
      .run((err, stats) => {
        if (err) {
          return reject(err);
        }

        const result = stats.toJson();
        if (stats.hasErrors()) {
          return reject(result.errors);
        }

        return resolve();
      });
  });
};

run(build);

export default build;
