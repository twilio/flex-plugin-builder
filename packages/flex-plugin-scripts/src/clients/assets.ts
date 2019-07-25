import axios from 'axios';
import { AuthConfig } from 'flex-dev-utils/dist/keytar';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { basename } from 'path';

import BaseClient from './baseClient';
import Http from './http';
import { Asset, AssetVersion, FileVisibility } from './serverless-types';
import ServiceClient from './services';

export default class AssetClient extends BaseClient {
  protected serviceSid: string;

  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);

    this.serviceSid = serviceSid;
  }

  /**
   * Uploads the provided filePath as a new {@link Asset}.
   * This endpoint creates a new {@link Asset}, a new {@link AssetVersion} for it, and then uploads the file to S3
   *
   * @param friendlyName  the friendlyName of the asset
   * @param uri           the uri of the Asset
   * @param localFilePath the local path to the file
   * @param isProtected   whether to upload this file as Public or Protected
   */
  public upload = async (friendlyName: string, uri: string, localFilePath: string, isProtected: boolean = true) => {
    const asset = await this._create(friendlyName);

    const contentConfig = {
      filename: basename(localFilePath),
      contentType: Http.getContentType(localFilePath),
    };
    const form = new FormData();
    form.append('Path', uri);
    form.append('Visibility', isProtected ? FileVisibility.Protected : FileVisibility.Public);
    form.append('Content', createReadStream(localFilePath), contentConfig);

    const baseUrl = ServiceClient.getBaseUrl('serverless-upload');
    const url = `${baseUrl}/Services/${this.serviceSid}/Assets/${asset.sid}/Versions`;

    return this.uploadFile(url, form);
  }

  private uploadFile = (url: string, formData: FormData): Promise<AssetVersion> => {
    return axios
      .post(url, formData, {
        headers: formData.getHeaders(),
        auth: {
          username: this.config.auth.accountSid,
          password: this.config.auth.authToken,
        },
      })
      .then((resp) => resp.data);
  }

  /**
   * Returns the {@link AssetVersion}
   *
   * @param assetSid    the asset sid
   * @param versionSid  the version sid
   * @private
   */
  private _getVersion = async (assetSid: string, versionSid: string): Promise<AssetVersion> => {
    return this.http
      .get(`Assets/${assetSid}/Versions/${versionSid}`);
  }

  /**
   * Creates a new {@link Asset}
   * @param friendlyName  the friendly name of the asset
   * @private
   */
  private _create = (friendlyName: string): Promise<Asset> => {
    return this.http
      .post<Asset>('Assets', {FriendlyName: friendlyName});
  }
}
