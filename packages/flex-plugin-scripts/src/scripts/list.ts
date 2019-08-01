import { logger } from 'flex-dev-utils';
import { getCredentials } from 'flex-dev-utils/dist/keytar';

import run from '../utils/run';
import { Visibility } from '../clients/serverless-types';
import pluginVersions from '../prints/pluginVersions';
import paths from '../utils/paths';
import getRuntime from '../utils/runtime';

const PLUGIN_REGEX_STR = '^\/plugins\/%PLUGIN_NAME%\/.*\/bundle\.js$';

export type Order = 'desc' | 'asc';

/**
 * Lists all versions of this plugin
 *
 * @param visibilities  the visibility of the version to show. This can be Public, Private or Both
 * @param order         the order of versions. This can be desc or asc
 * @private
 */
export const _doList = async (visibilities: Visibility[], order: Order = 'asc') => {
  logger.info('Fetching all available versions of plugin %s', paths.packageName);

  const credentials = await getCredentials();
  const runtime = await getRuntime(credentials);
  const regex = new RegExp(PLUGIN_REGEX_STR.replace('%PLUGIN_NAME%', paths.packageName));

  const assets = runtime.build && runtime.build.asset_versions || [];
  const versions = assets
    .filter((a) => regex.test(a.path))
    .filter((a) => visibilities.includes(a.visibility));

  if (versions.length === 0) {
    logger.newline();
    logger.info('No versions of plugin %s have been deployed', paths.packageName);
    logger.newline();

    return process.exit(0);
  }

  pluginVersions(runtime.environment.domain_name, versions, order);
};

/**
 * Checks the process argument and calls the {@link _doList}
 *
 * @param argv
 */
const list = async (...argv: string[]) => {
  const publicOnly = argv.includes('--public-only');
  const privateOnly = argv.includes('--private-only');
  const order = argv.includes('--desc') ? 'desc' : 'asc';

  if (publicOnly && privateOnly) {
    logger.error('You cannot use --public-only and --private-only flags together.');
    return process.exit(1);
  }

  const visibilities: Visibility[] = [];
  if (publicOnly) {
    visibilities.push(Visibility.Public);
  } else if (privateOnly) {
    visibilities.push(Visibility.Protected);
  } else {
    visibilities.push(Visibility.Public);
    visibilities.push(Visibility.Protected);
  }

  await _doList(visibilities, order);
};

run(list);

export default list;
