import { Credential } from 'flex-dev-utils';
import { Runtime } from '../clients/serverless-types';
/**
 * Attempts to fetch the Service and Environment. If no Environment is found, will quit the script
 *
 * @param credentials the credentials
 * @private
 */
export declare const _getRuntime: (credentials: Credential) => Promise<Runtime>;
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
