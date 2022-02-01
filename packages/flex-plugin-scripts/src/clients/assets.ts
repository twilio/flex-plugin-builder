import { Credential } from '@twilio/flex-dev-utils';

import FileClient from './files';

export default class AssetClient extends FileClient {
  constructor(auth: Credential, serviceSid: string) {
    super(auth, 'Assets', serviceSid);
  }
}
