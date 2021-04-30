import { Credential } from 'flex-dev-utils';
import { Runtime } from '../clients/serverless-types';
/**
 * Fetches the {@link Runtime}
 *
 * @return a Promise of {@link Runtime}
 */
declare const getRuntime: (credentials: Credential, serviceOnly?: boolean) => Promise<Runtime>;
export default getRuntime;
