import { AuthConfig } from 'flex-dev-utils/dist/keytar';
import FilesClient from './files';

export default class AssetClient extends FilesClient {
  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, 'Assets', serviceSid);
  }
}
