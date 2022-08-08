import { logger, FlexPluginError, exit } from '@twilio/flex-dev-utils';
import { getCredential } from '@twilio/flex-dev-utils/dist/credentials';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';

import run from '../utils/run';
import { Visibility } from '../clients';
import pluginVersions from '../prints/pluginVersions';
import getRuntime from '../utils/runtime';

const PLUGIN_REGEX_STR = '^/plugins/%PLUGIN_NAME%/.*/bundle.js$';

export type Order = 'desc' | 'asc';

/**
 * Lists all versions of this plugin
 *
 * @param visibilities  the visibility of the version to show. This can be Public, Private or Both
 * @param order         the order of versions. This can be desc or asc
 * @private
 */
export const _doList = async (visibilities: Visibility[], order: Order = 'asc'): Promise<void> => {
  logger.info('Fetching all available versions of plugin %s', getPaths().app.name);

  const credentials = await getCredential();
  const runtime = await getRuntime(credentials);
  const regex = new RegExp(PLUGIN_REGEX_STR.replace('%PLUGIN_NAME%', getPaths().app.name));

  const assets = (runtime.build && runtime.build.asset_versions) || [];
  const versions = assets.filter((a) => regex.test(a.path)).filter((a) => visibilities.includes(a.visibility));

  if (versions.length === 0) {
    logger.newline();
    logger.info('No versions of plugin %s have been deployed', getPaths().app.name);
    logger.newline();

    exit(0);
    return;
  }
  if (!runtime.environment) {
    throw new FlexPluginError('No Runtime environment was found');
  }

  pluginVersions(runtime.environment.domain_name, versions, order);
};

/**
 * Checks the process argument and calls the {@link _doList}
 *
 * @param argv
 */
const list = async (...argv: string[]): Promise<void> => {
  logger.debug('Listing plugin versions');

  const publicOnly = argv.includes('--public-only');
  const privateOnly = argv.includes('--private-only');
  const order = argv.includes('--desc') ? 'desc' : 'asc';

  if (publicOnly && privateOnly) {
    throw new FlexPluginError('You cannot use --public-only and --private-only flags together.');
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run(list);

// eslint-disable-next-line import/no-unused-modules
export default list;
