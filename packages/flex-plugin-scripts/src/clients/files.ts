/* eslint-disable camelcase */
import { createReadStream } from 'fs';
import { basename } from 'path';

import { HttpClient, TwilioCliError, urlJoin, FormData } from '@twilio/flex-dev-utils';
import { isSidOfType, SidPrefix } from '@twilio/flex-dev-utils/dist/sids';

import ServerlessClient from './serverless-client';

export interface ServerlessFile {
  sid: string;
  account_sid: string;
  url: string;
  date_updated: string;
  date_created: string;
  friendly_name: string;
  service_sid: string;
}

export enum FileVisibility {
  Public = 'Public',
  Protected = 'Protected',
}

type FileTypes = 'Functions' | 'Assets';

export default abstract class FilesClient {
  private static ContentTypeApplicationJson = 'application/json';

  private static ContentTypeApplicationJavaScript = 'application/javascript';

  private static ContentTypeApplicationOctet = 'application/octet-stream';

  private readonly http: ServerlessClient;

  private readonly fileType: FileTypes;

  private readonly serviceSid: string;

  protected constructor(http: ServerlessClient, fileType: FileTypes, serviceSid: string) {
    if (!isSidOfType(serviceSid, SidPrefix.ServiceSid)) {
      throw new TwilioCliError(`${serviceSid} is not of type ${SidPrefix.ServiceSid}`);
    }

    this.http = http;
    this.serviceSid = serviceSid;
    this.fileType = fileType;
  }

  /**
   * Determines the content type based on file extension
   *
   * @param filePath  the local path to the file
   * @returns the content type
   */
  private static getContentType = (filePath: string): string => {
    const ext = filePath.split('.').pop();

    if (ext === 'js') {
      return FilesClient.ContentTypeApplicationJavaScript;
    } else if (ext === 'map') {
      return FilesClient.ContentTypeApplicationJson;
    }

    return FilesClient.ContentTypeApplicationOctet;
  };

  /**
   * Uploads the provided filePath as a new {@link File}.
   * This endpoint creates a new {@link ServerlessFile}, a new {@link ServerlessFileVersion} for it, and then uploads the file to S3
   *
   * @param friendlyName  the friendlyName of the File
   * @param uri           the uri of the File
   * @param localFilePath the local path to the file
   * @param isProtected   whether to upload this file as Public or Protected
   */
  /* c8 ignore next */
  public upload = async (
    friendlyName: string,
    uri: string,
    localFilePath: string,
    isProtected: boolean = true,
  ): Promise<ServerlessFile> => {
    const file = await this._create(friendlyName);

    const contentConfig = {
      filename: basename(localFilePath),
      contentType: FilesClient.getContentType(localFilePath),
    };
    const form = new FormData();
    form.append('Path', uri);
    form.append('Visibility', isProtected ? FileVisibility.Protected : FileVisibility.Public);
    form.append('Content', createReadStream(localFilePath), contentConfig);

    const baseURL = HttpClient.getBaseUrl('https://serverless-upload.twilio.com/v1');
    const url = urlJoin('Services', this.serviceSid, this.fileType, file.sid, 'Versions');

    return this.http.upload(url, form, { baseURL });
  };

  /**
   * Creates a new {@link File}
   * @param friendlyName  the friendly name of the file
   * @private
   */
  private _create = async (friendlyName: string): Promise<ServerlessFile> => {
    const url = urlJoin('Services', this.serviceSid, this.fileType);

    return this.http.post<ServerlessFile>(url, { FriendlyName: friendlyName });
  };
}
