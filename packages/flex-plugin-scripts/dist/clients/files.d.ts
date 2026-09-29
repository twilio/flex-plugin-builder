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
export declare enum FileVisibility {
    Public = "Public",
    Protected = "Protected"
}
declare type FileTypes = 'Functions' | 'Assets';
export default abstract class FilesClient {
    private static ContentTypeApplicationJson;
    private static ContentTypeApplicationJavaScript;
    private static ContentTypeApplicationOctet;
    private readonly http;
    private readonly fileType;
    private readonly serviceSid;
    protected constructor(http: ServerlessClient, fileType: FileTypes, serviceSid: string);
    /**
     * Determines the content type based on file extension
     *
     * @param filePath  the local path to the file
     * @returns the content type
     */
    private static getContentType;
    /**
     * Uploads the provided filePath as a new {@link File}.
     * This endpoint creates a new {@link ServerlessFile}, a new {@link ServerlessFileVersion} for it, and then uploads the file to S3
     *
     * @param friendlyName  the friendlyName of the File
     * @param uri           the uri of the File
     * @param localFilePath the local path to the file
     * @param isProtected   whether to upload this file as Public or Protected
     */
    upload: (friendlyName: string, uri: string, localFilePath: string, isProtected?: boolean) => Promise<ServerlessFile>;
    /**
     * Creates a new {@link File}
     * @param friendlyName  the friendly name of the file
     * @private
     */
    private _create;
}
export {};
