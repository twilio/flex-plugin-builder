import { AuthConfig } from 'flex-dev-utils/dist/keytar';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { basename } from 'path';

import BaseClient from './baseClient';
import Http from './http';
import { FileVisibility, Version, File } from './serverless-types';
import ServiceClient from './services';

type FileTypes = 'Functions' | 'Assets';

export  default abstract class FilesClient extends BaseClient {
  protected serviceSid: string;
  private readonly fileType: FileTypes;

  protected constructor(auth: AuthConfig, fileType: FileTypes,  serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);

    this.fileType = fileType;
    this.serviceSid = serviceSid;
  }

  /**
   * Uploads the provided filePath as a new {@link File}.
   * This endpoint creates a new {@link File}, a new {@link Version} for it, and then uploads the file to S3
   *
   * @param friendlyName  the friendlyName of the File
   * @param uri           the uri of the File
   * @param localFilePath the local path to the file
   * @param isProtected   whether to upload this file as Public or Protected
   */
  public upload = async (friendlyName: string, uri: string, localFilePath: string, isProtected: boolean = true) => {
    const file = await this._create(friendlyName);

    const contentConfig = {
      filename: basename(localFilePath),
      contentType: Http.getContentType(localFilePath),
    };
    const form = new FormData();
    form.append('Path', uri);
    form.append('Visibility', isProtected ? FileVisibility.Protected : FileVisibility.Public);
    form.append('Content', createReadStream(localFilePath), contentConfig);

    const baseUrl = ServiceClient.getBaseUrl('serverless-upload');
    const url = `${baseUrl}/Services/${this.serviceSid}/${this.fileType}/${file.sid}/Versions`;

    return this.http.upload(url, form);
  }

  /**
   * Returns the {@link Version}
   *
   * @param fileSid     the file sid
   * @param versionSid  the version sid
   * @private
   */
  public getVersion = async (fileSid: string, versionSid: string): Promise<Version> => {
    return this.http
      .get(`${this.fileType}/${fileSid}/Versions/${versionSid}`);
  }

  /**
   * Creates a new {@link File}
   * @param friendlyName  the friendly name of the file
   * @private
   */
  private _create = (friendlyName: string): Promise<File> => {
    return this.http
      .post<File>(this.fileType, {FriendlyName: friendlyName});
  }
}
