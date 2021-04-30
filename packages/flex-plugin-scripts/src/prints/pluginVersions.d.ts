import { AssetVersion } from '../clients/serverless-types';
import { Order } from '../scripts/list';
declare const _default: (domainName: string, versions: AssetVersion[], order: Order) => void;
/**
 * Prints the list of versions of the plugin in the provided order
 *
 * @param domainName  the Twilio Runtime domain
 * @param versions    the list of versions
 * @param order       the order to display the result
 */
export default _default;
