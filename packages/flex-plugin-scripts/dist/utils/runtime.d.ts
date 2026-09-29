import { Credential } from '@twilio/flex-dev-utils';
import { ServerlessRuntime } from '../clients';
/**
 * Fetches the {@link Runtime}
 *
 * @return a Promise of {@link Runtime}
 */
declare const getRuntime: (credentials: Credential, serviceOnly?: boolean) => Promise<ServerlessRuntime>;
export default getRuntime;
