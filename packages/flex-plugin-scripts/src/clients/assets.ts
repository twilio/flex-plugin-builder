import { AuthConfig } from './auth';
import BaseClient from './baseClient';
import { Asset, AssetVersion, PresignedUrl, FileVisibility, VersionCreated } from './serverless-types';
import ServiceClient from './services';

export default class AssetClient extends BaseClient {
  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth, `${ServiceClient.baseUrl}/Services/${serviceSid}`);
  }

  /**
   * Uploads the provided filePath as a new {@link Asset}.
   * This endpoint creates a new {@link Asset}, a new {@link AssetVersion} for it, and then uploads the file to S3
   *
   * @param friendlyName  the friendlyName of the asset
   * @param uri           the uri of the Asset
   * @param localFilePath the local path to the file
   * @param isProtected    whether to upload this file as Public or Protected
   */
  public upload = async (friendlyName: string, uri: string, localFilePath: string, isProtected: boolean = true): Promise<AssetVersion> => {
    const asset = await this._create(friendlyName);
    const version = await this._createVersion(asset.sid, uri, isProtected);

    await this._uploadToS3(version.pre_signed_upload_url, localFilePath);

    return this._getVersion(asset.sid, version.sid);
  };

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
  };

  /**
   * Creates a new {@link Asset}
   * @param friendlyName  the friendly name of the asset
   * @private
   */
  private _create = (friendlyName: string): Promise<Asset> => {
    return this.http
      .post<Asset>('Assets', {FriendlyName: friendlyName});
  };

  /**
   * Creates a new {@link AssetVersion}
   * @param assetSid      the asset sid
   * @param uri           the uri of the asset
   * @param isProtected   whether Asset is to be Public or Protected
   * @private
   */
  private _createVersion = (assetSid: string, uri: string, isProtected: boolean = true): Promise<VersionCreated> => {
    const data = {
      Path: uri,
      Visibility: isProtected ? FileVisibility.Protected : FileVisibility.Public,
    };

    return this.http
      .post(`Assets/${assetSid}/Versions`, data);
  };

  /**
   * Uploads the file to S3 using the pre-signed url
   *
   * @param presignedUrl  the {@link PresignedUrl} object
   * @param localFilePath the local path to file
   * @private
   */
  private _uploadToS3 = (presignedUrl: PresignedUrl, localFilePath: string): Promise<any> => {
    return this.http.uploadToS3(localFilePath, presignedUrl.url, presignedUrl.kmsARN);
  };
}
