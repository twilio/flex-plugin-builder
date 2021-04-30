import { Credential } from 'flex-dev-utils';
import FileClient from './files';
export default class AssetClient extends FileClient {
    constructor(auth: Credential, serviceSid: string);
}
