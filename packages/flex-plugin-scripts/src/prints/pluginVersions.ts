import { logger, semver, table } from '@twilio/flex-dev-utils';

import { AssetVersion, Visibility } from '../clients';
import { Order } from '../scripts/list';

interface DisplayList {
  type: string;
  version: string;
  url: string;
}

const VERSION_MATCH_REGEX = /^\/plugins\/.*\/(.*)\/bundle.js$/;
const warningMsg = 'You plugin does not follow SemVer versioning; the list below may not be ordered.';

/**
 * Prints the list of versions of the plugin in the provided order
 *
 * @param domainName  the Twilio Runtime domain
 * @param versions    the list of versions
 * @param order       the order to display the result
 */
export default (domainName: string, versions: AssetVersion[], order: Order): void => {
  const list: DisplayList[] = versions.map((version) => {
    const match = version.path.match(VERSION_MATCH_REGEX);

    return {
      type: version.visibility === Visibility.Protected ? 'Private' : 'Public',
      version: match ? match[1] : 'N/A',
      url: `https://${domainName}${version.path}`,
    };
  });

  const isSemver = list.every((v) => semver.valid(v.version) !== null);
  let rows;

  if (isSemver) {
    const _list = list.map((v) => v.version);
    const sortedVersions = order === 'asc' ? semver.sort(_list) : semver.rsort(_list);
    rows = sortedVersions.map((version: string) => list.find((v) => v.version === version) as DisplayList);
  } else {
    logger.warning(warningMsg);
    rows = list;
  }

  logger.newline();
  table.printObjectArray(rows);
  logger.newline();
};
