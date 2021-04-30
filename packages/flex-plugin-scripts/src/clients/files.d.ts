import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
import { File } from './serverless-types';
declare type FileTypes = 'Functions' | 'Assets';
export default abstract class FilesClient extends BaseClient {
    protected serviceSid: string;
    private readonly fileType;
    protected constructor(auth: Credential, fileType: FileTypes, serviceSid: string);
    /**
     * Uploads the provided filePath as a new {@link File}.
     * This endpoint creates a new {@link File}, a new {@link Version} for it, and then uploads the file to S3
     *
     * @param friendlyName  the friendlyName of the File
     * @param uri           the uri of the File
     * @param localFilePath the local path to the file
     * @param isProtected   whether to upload this file as Public or Protected
     */
    upload: (friendlyName: string, uri: string, localFilePath: string, isProtected?: boolean) => Promise<File>;
    /**
     * Creates a new {@link File}
     * @param friendlyName  the friendly name of the file
     * @private
     */
    private _create;
}
export {};
