import { createReadStream } from 'fs';
import { basename } from 'path';

import { Credential } from '@twilio/flex-dev-utils';
import FormData from 'form-data';
import { isSidOfType } from '@twilio/flex-dev-utils/dist/sids';

import BaseClient from './baseClient';
import Http from './http';
import { FileVisibility, File } from './serverless-types';
import ServiceClient from './services';

type FileTypes = 'Functions' | 'Assets';

export default abstract class FilesClient extends BaseClient {
  protected serviceSid: string;

  private readonly fileType: FileTypes;

  protected constructor(auth: Credential, fileType: FileTypes, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);

    if (!isSidOfType(serviceSid, 'ZS')) {
      throw new Error(`ServiceSid ${serviceSid} is not valid`);
    }

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
  /* istanbul ignore next */
  public upload = async (
    friendlyName: string,
    uri: string,
    localFilePath: string,
    isProtected: boolean = true,
  ): Promise<File> => {
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
  };

  /**
   * Creates a new {@link File}
   * @param friendlyName  the friendly name of the file
   * @private
   */
  private _create = async (friendlyName: string): Promise<File> => {
    return this.http.post<File>(this.fileType, { FriendlyName: friendlyName });
  };
}
