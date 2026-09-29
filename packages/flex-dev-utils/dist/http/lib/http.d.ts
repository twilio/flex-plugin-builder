import FormData from 'form-data';
import { AxiosCacheInstance, InternalCacheRequestConfig, CacheRequestConfig } from 'axios-cache-interceptor';
import { AxiosRequestConfig } from 'axios';
declare type RequestInterceptor = (req: InternalCacheRequestConfig) => Promise<InternalCacheRequestConfig>;
interface Concurrency {
    pending: number;
    max: number;
}
interface RequestOption {
    cacheable?: boolean;
    cacheAge?: number;
}
export interface AuthConfig {
    username: string;
    password: string;
}
export interface OptionalHttpClientConfig {
    supportProxy?: boolean;
    caller?: string;
    setUserAgent?: boolean;
    packages?: {
        [key: string]: string;
    };
    json?: boolean;
    simpleQS?: boolean;
    auth?: AuthConfig;
    headers?: {
        [key: string]: string;
    };
    requestInterceptors?: [RequestInterceptor];
    maxConcurrentRequests?: number;
    skipCacheSetup?: boolean;
}
export interface HttpClientConfig extends OptionalHttpClientConfig {
    baseURL: string;
}
export interface Pagination {
    pageSize?: number;
    page?: number;
    pageToken?: string;
}
export interface Meta {
    page: number;
    page_size: number;
    first_page_url: string;
    previous_page_url: string | null;
    url: string;
    next_page_url?: string;
    key: string;
    next_token?: string;
    previous_token?: string;
}
export interface PaginationMeta {
    meta: Meta;
}
export default class Http {
    static DEFAULT_CONCURRENT_REQUESTS: number;
    static CONCURRENCY_REQUEST_LOOP_MS_DELAY: number;
    static REGIONS: string[];
    static UserAgent: string;
    static REALM: string;
    static ContentTypeApplicationJson: string;
    static ContentTypeUrlEncoded: string;
    protected readonly client: AxiosCacheInstance;
    protected readonly cacheAge: number;
    protected readonly concurrency: Concurrency;
    protected readonly config: HttpClientConfig;
    protected readonly axiosConfig: AxiosRequestConfig;
    constructor(config: HttpClientConfig);
    /**
     * Creates an instance of the http client and calls the {@link #get} method.
     */
    static get<R>(uri: string, option?: RequestOption): Promise<R>;
    /**
     * Creates an instance of the http client and calls the {@link #post} method.
     */
    static post<R>(uri: string, data: object, options?: CacheRequestConfig): Promise<R>;
    /**
     * Creates an instance of the http client and calls the {@link #delete} method.
     */
    static delete(uri: string): Promise<void>;
    /**
     * Creates an instance of the http client and calls the {@link #upload} method.
     */
    static upload<T>(uri: string, formData: FormData, options?: CacheRequestConfig): Promise<T>;
    /**
     * Creates an instance of the http client and calls the {@link #download} method.
     */
    static download(url: string, directory: string, config?: CacheRequestConfig): Promise<void>;
    /**
     * Appends the region to the baseUrl if it is twilio.com domain
     * @param baseUrl the baseUrl to use
     * @private
     */
    static getBaseUrl(baseUrl: string): string;
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
    /**
     * List API endpoint with pagination support
     * @param uri           the uri endpoint
     * @param responseKey  response key
     * @param pagination    the request option
     */
    list<R extends PaginationMeta>(uri: string, responseKey: string, pagination?: Pagination): Promise<R>;
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
    post<R>(uri: string, data: object, options?: CacheRequestConfig): Promise<R>;
    /**
     * Makes a delete request
     *
     * @param uri   the uri of the endpoint
     */
    delete(uri: string): Promise<void>;
    /**
     * Uploads the {@link FormData} to the URL
     *
     * @param uri       the url to upload to
     * @param formData  the {@link FormData}
     * @param options  the optional extra {@link AxiosRequestConfig} to pass
     */
    upload<T>(uri: string, formData: FormData, options?: CacheRequestConfig): Promise<T>;
    /**
     * Downloads the file to the given directory
     * @param url the url of the file to download
     * @param directory the directory to download to
     * @param config optional {@link AxiosRequestConfig}
     */
    download(url: string, directory: string, config?: CacheRequestConfig): Promise<void>;
    /**
     * Create the upload configuration
     * @param formData
     */
    private getUploadOptions;
    /**
     * Calculates the {@link FormData} size
     * @param formData the formData to calculate the size of
     */
    private getFormDataSize;
    /**
     * Sets up all the request interceptors
     * @param interceptors the interceptors to setup
     * @private
     */
    private useRequestInterceptors;
    /**
     * Setups a concurrency on the HTTP requests
     * @param req
     * @private
     */
    private concurrencyRequestTransform;
    /**
     * Transforms the response object
     * @param resp
     */
    private transformResponse;
    /**
     * Transforms the rejection into a Twilio API Error if possible
     * @param err
     */
    private transformResponseError;
    /**
     * Increments concurrent request counter
     */
    private incrementConcurrentRequests;
    /**
     * Decrements concurrent request counter
     */
    private decrementConcurrentRequests;
    /**
     * Returns a {@link AxiosRequestConfig} configuration
     * @param option  request configuration
     */
    private getRequestOption;
}
export {};
