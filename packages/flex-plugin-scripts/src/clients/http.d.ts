import { AxiosInstance } from 'flex-dev-utils/dist/axios';
import { Credential } from 'flex-dev-utils';
import FormData from 'form-data';
export declare type ContentType = 'application/x-www-form-urlencoded' | 'application/json';
export interface HttpConfig {
    baseURL: string;
    userAgent?: string;
    auth: Credential;
    exitOnRejection?: boolean;
    contentType?: ContentType;
}
export default class Http {
    protected readonly client: AxiosInstance;
    private readonly config;
    private readonly jsonPOST;
    constructor(config: HttpConfig);
    /**
     * Determines the content type based on file extension
     *
     * @param filePath  the local path to the file
     * @returns the content type
     */
    static getContentType: (filePath: string) => string;
    /**
     * List API endpoint; makes a GET request and returns an array of R
     * @param uri   the uri endpoint
     */
    list<R>(uri: string): Promise<R[]>;
    /**
     * Makes a GET request to return an instance
     * @param uri   the uri endpoint
     */
    get<R>(uri: string): Promise<R>;
    /**
     * Makes a POST request
     * @param uri   the uri of the endpoint
     * @param data  the data to post
     */
    post<R>(uri: string, data: any): Promise<R>;
    /**
     * Makes a delete request
     *
     * @param uri   the uri of the endpoint
     */
    delete(uri: string): Promise<void>;
    /**
     * Uploads the {@link FormData} to the URL
     *
     * @param url       the url to upload to
     * @param formData  the {@link FormData}
     */
    upload: <T>(url: string, formData: FormData) => Promise<T>;
    /**
     * Create the upload configuration
     * @param formData
     */
    private getUploadOptions;
    /**
     * Private error handler
     * @param err Axios error
     */
    private onError;
    /**
     * Calculates the {@link FormData} size
     * @param formData the formData to calculate the size of
     */
    private getFormDataSize;
}
