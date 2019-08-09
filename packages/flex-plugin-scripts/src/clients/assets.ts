import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import FileClient from './files';

export default class AssetClient extends FileClient {
  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, 'Assets', serviceSid);
  }
}
