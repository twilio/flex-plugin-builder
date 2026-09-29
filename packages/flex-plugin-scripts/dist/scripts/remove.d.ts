import { Credential } from '@twilio/flex-dev-utils';
import { ServerlessRuntime } from '../clients';
/**
 * Attempts to fetch the Service and Environment. If no Environment is found, will quit the script
 *
 * @param credentials the credentials
 * @private
 */
export declare const _getRuntime: (credentials: Credential) => Promise<ServerlessRuntime>;
/**
 * Performs the delete action
 * @private
 */
export declare const _doRemove: () => Promise<void>;
/**
 * Removes the plugin by deleting it's associated Environment
 */
declare const remove: () => Promise<void>;
export default remove;
