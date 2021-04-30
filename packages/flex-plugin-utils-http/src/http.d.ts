import { AxiosInstance, AxiosRequestConfig } from 'axios';
interface RequestOption {
    cacheable?: boolean;
    cacheAge?: number;
}
export interface AuthConfig {
    username: string;
    password: string;
}
export interface OptionalHttpConfig {
    caller?: string;
    setUserAgent?: boolean;
    packages?: {
        [key: string]: string;
    };
    auth?: AuthConfig;
    headers?: {
        [key: string]: string;
    };
    requestInterceptors?: [(req: AxiosRequestConfig) => AxiosRequestConfig];
}
export interface HttpConfig extends OptionalHttpConfig {
    baseURL: string;
}
export default class Http {
    static ContentType: string;
    static UserAgent: string;
    protected readonly client: AxiosInstance;
    protected readonly cacheAge: number;
    constructor(config: HttpConfig);
    /**
     * Calculates and returns the User-Agent header
     * @param config
     */
    private static getUserAgent;
    /**
     * Pretty prints a JSON object
     * @param obj
     */
    private static prettyPrint;
    /**
     * Determines if the exception is a Twilio API response error
     * @param err
     */
    private static isTwilioError;
    /**
     * Transforms the POST param if provided as object
     * @param req
     */
    private static transformRequestFormData;
    private static transformRequest;
    /**
     * Transforms the response object
     * @param resp
     */
    private static transformResponse;
    /**
     * Transforms the rejection into a Twilio API Error if possible
     * @param err
     */
    private static transformResponseError;
    /**
     * Makes a GET request
     * @param uri   the uri endpoint
     * @param option  the request option
     */
    get<R>(uri: string, option?: RequestOption): Promise<R>;
    /**
     * Makes a POST request
     * @param uri   the uri of the endpoint
     * @param data  the data to post
     */
    post<R>(uri: string, data: object): Promise<R>;
    /**
     * Makes a delete request
     *
     * @param uri   the uri of the endpoint
     */
    delete(uri: string): Promise<void>;
    /**
     * Returns a {@link AxiosRequestConfig} configuration
     * @param option  request configuration
     */
    private getRequestOption;
}
export {};
