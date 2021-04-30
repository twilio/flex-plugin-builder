import { ServiceUrl } from 'flex-dev-utils/dist/urls';
import { Plugin } from '../devServer/pluginServer';
declare const _default: (local: ServiceUrl, network: ServiceUrl, localPlugins: string[], remotePlugins: Plugin[], hasRemote: boolean) => void;
/**
 * Prints the success message when dev-server compiles
 * @param local     the local port
 * @param network   the local network
 * @param localPlugins  the list of local plugins
 * @param remotePlugins the list of remote plugins
 * @param hasRemote whether remote plugins are running
 */
export default _default;
