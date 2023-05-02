/* eslint-disable camelcase */

import { Transform } from 'stream';
import path from 'path';

import FormData from 'form-data';
import qs from 'qs';
import { setupCache } from 'axios-cache-adapter';
import { HttpsProxyAgent } from 'https-proxy-agent';
// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import settle from 'axios/lib/core/settle';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import * as fs from '../../fs';
import { env } from '../../env';
import { logger } from '../../logger';
import { TwilioApiError, TwilioCliError } from '../../errors';
import { upperFirst } from '../../lodash';

interface UploadRequestConfig extends AxiosRequestConfig {
  headers: Record<string, string>;
}

type RequestInterceptor = (req: AxiosRequestConfig) => Promise<AxiosRequestConfig>;
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
  // If set to true, will send request as application/json
  json?: boolean;
  // If set to true will do simple qs.stringify
  simpleQS?: boolean;
  auth?: AuthConfig;
  headers?: {
    [key: string]: string;
  };
  requestInterceptors?: [RequestInterceptor];
  maxConcurrentRequests?: number;
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
  static DEFAULT_CONCURRENT_REQUESTS = 5;

  static CONCURRENCY_REQUEST_LOOP_MS_DELAY = 100;

  static REGIONS = ['dev', 'stage'];

  static UserAgent = 'User-Agent';

  public static ContentTypeApplicationJson = 'application/json';

  public static ContentTypeUrlEncoded = 'application/x-www-form-urlencoded';

  protected readonly client: AxiosInstance;

  protected readonly cacheAge: number;

  protected readonly concurrency: Concurrency;

  protected readonly config: HttpClientConfig;

  protected readonly axiosConfig: AxiosRequestConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
    this.cacheAge = 15 * 60 * 1000;
    const cache = setupCache({ maxAge: 0 });

    this.axiosConfig = {
      baseURL: Http.getBaseUrl(config.baseURL),
      headers: {
        'Content-Type': config.json ? Http.ContentTypeApplicationJson : Http.ContentTypeUrlEncoded,
        ...config.headers,
      },
      adapter: cache.adapter,
    };

    if (config.auth) {
      this.axiosConfig.auth = {
        username: config.auth.username,
        password: config.auth.password,
      };
    }
    if (config.setUserAgent) {
      /* c8 ignore next */
      if (!this.axiosConfig.headers) {
        this.axiosConfig.headers = {};
      }
      this.axiosConfig.headers[Http.UserAgent] = Http.getUserAgent(config);
    }

    // Set the Http Proxy if provided
    if (config.supportProxy && env.hasHttpProxy()) {
      this.axiosConfig.proxy = false;
      this.axiosConfig.httpsAgent = new HttpsProxyAgent(env.getHttpProxy());
    }

    this.client = axios.create(this.axiosConfig);

    this.concurrency = {
      pending: 0,
      max: config.maxConcurrentRequests || Http.DEFAULT_CONCURRENT_REQUESTS,
    };
    this.client.interceptors.request.use(
      this.useRequestInterceptors(
        [this.concurrencyRequestTransform, Http.transformRequestFormData].concat(config.requestInterceptors || []),
      ),
    );
    this.client.interceptors.response.use(this.transformResponse, this.transformResponseError);
  }

  /**
   * Creates an instance of the http client and calls the {@link #get} method.
   */
  /* c8 ignore next */
  public static async get<R>(uri: string, option?: RequestOption): Promise<R> {
    return new Http({ baseURL: '' }).get(uri, option);
  }

  /**
   * Creates an instance of the http client and calls the {@link #post} method.
   */
  /* c8 ignore next */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static async post<R>(uri: string, data: object, options?: AxiosRequestConfig): Promise<R> {
    return new Http({ baseURL: '' }).post(uri, data, options);
  }

  /**
   * Creates an instance of the http client and calls the {@link #delete} method.
   */
  /* c8 ignore next */
  public static async delete(uri: string): Promise<void> {
    return new Http({ baseURL: '' }).delete(uri);
  }

  /**
   * Creates an instance of the http client and calls the {@link #upload} method.
   */
  /* c8 ignore next */
  public static async upload<T>(uri: string, formData: FormData, options?: AxiosRequestConfig): Promise<T> {
    return new Http({ baseURL: '' }).upload(uri, formData, options);
  }

  /**
   * Creates an instance of the http client and calls the {@link #download} method.
   */
  /* c8 ignore next */
  public static async download(url: string, directory: string, config?: AxiosRequestConfig): Promise<void> {
    return new Http({ baseURL: '' }).download(url, directory, config);
  }

  /**
   * Appends the region to the baseUrl if it is twilio.com domain
   * @param baseUrl the baseUrl to use
   * @private
   */
  public static getBaseUrl(baseUrl: string): string {
    if (!baseUrl.includes('twilio.com')) {
      return baseUrl;
    }

    const region = env.getRegion();
    if (!region) {
      return baseUrl;
    }

    if (!Http.REGIONS.includes(region)) {
      throw new TwilioCliError(
        `Invalid region ${region} was provided. Region must be one of ${Http.REGIONS.join(',')}`,
      );
    }

    Http.REGIONS.forEach((r) => {
      baseUrl = baseUrl.replace(`.${r}.`, '.');
    });

    return baseUrl.replace(/([a-zA-z-]+).(twilio.com)/, `$1.${region}.$2`);
  }

  /**
   * Calculates and returns the User-Agent header
   * @param config
   */
  private static getUserAgent(config: HttpClientConfig) {
    const packages = config.packages || {};

    const userAgent: string[] = [];
    if (env.isNode()) {
      userAgent.push(`Node.js/${process.version.slice(1)}`, `(${process.platform}; ${process.arch})`);
      const shell = process.env.SHELL?.split('/').pop() || 'unknown';
      userAgent.push(`shell/${shell}`);
      if (process.versions.yarn) {
        userAgent.push(`yarn/${process.versions.yarn}`);
      }
      if (process.versions.npm) {
        userAgent.push(`npm/${process.versions.npm}`);
      }
    } else {
      userAgent.push(window.navigator.userAgent);
    }
    if (config.caller) {
      userAgent.push(`caller/${config.caller}`);
    }

    Object.entries(packages).forEach(([key, value]) => userAgent.push(`${key}/${value}`));
    userAgent.push(`is_ci/${env.isCI()}`);

    return userAgent.join(' ');
  }

  /**
   * Pretty prints a JSON object
   * @param obj
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  private static prettyPrint(obj: object) {
    return JSON.stringify(obj, null, 2);
  }

  /**
   * Determines if the exception is a Twilio API response error
   * @param err
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static isTwilioError(err: any) {
    return Boolean(err && err.isAxiosError && err.response && err.response.data && err.response.data.more_info);
  }

  /**
   * Transforms the POST param if provided as object
   * @param req
   */
  private static async transformRequestFormData(req: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const method = req.method ? req.method : 'GET';
    logger.debug(`Making a ${method.toUpperCase()} to ${req.baseURL}/${req.url}`);

    // Transform data to urlencoded
    if (
      method.toLocaleLowerCase() === 'post' &&
      req.headers?.['Content-Type'] === Http.ContentTypeUrlEncoded &&
      typeof req.data === 'object'
    ) {
      // This is formatting array of objects into a format Twilio Public API can consume
      const data = Object.keys(req.data).map((key) => {
        if (!Array.isArray(req.data[key])) {
          return { [key]: req.data[key] };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = req.data[key].map((v: any) => {
          if (typeof v !== 'object') {
            return v;
          }

          return JSON.stringify(v);
        });

        return { [key]: value };
      });

      req.data = qs.stringify(Object.assign({}, ...data), { encode: false, arrayFormat: 'repeat' });
      logger.debug(`Request data ${req.data} and content-type ${req.headers?.['Content-Type']}`);
    }

    return Promise.resolve(req);
  }

  /**
   * List API endpoint with pagination support
   * @param uri           the uri endpoint
   * @param responseKey  response key
   * @param pagination    the request option
   */
  public async list<R extends PaginationMeta>(uri: string, responseKey: string, pagination?: Pagination): Promise<R> {
    const params = new URLSearchParams();
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => params.set(upperFirst(key), value));
    }

    const resp = await this.get<R>(`${uri}?${params.toString()}`);
    if (resp.meta.next_page_url) {
      const next = new URL(resp.meta.next_page_url);
      if (next.searchParams.has('PageToken')) {
        resp.meta.next_token = next.searchParams.get('PageToken') as string;
      }
    }
    if (resp.meta.previous_page_url) {
      const prev = new URL(resp.meta.previous_page_url);
      if (prev.searchParams.has('PageToken')) {
        resp.meta.previous_token = prev.searchParams.get('PageToken') as string;
      }
    }

    const resultKey = 'results';
    if (!resp[responseKey] && resp[resultKey]) {
      resp[responseKey] = resp[resultKey];
      delete resp[resultKey];
    }

    return resp;
  }

  /**
   * Makes a GET request
   * @param uri   the uri endpoint
   * @param option  the request option
   */
  public async get<R>(uri: string, option?: RequestOption): Promise<R> {
    return this.client.get(uri, this.getRequestOption(option));
  }

  /**
   * Makes a POST request
   * @param uri   the uri of the endpoint
   * @param data  the data to post
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async post<R>(uri: string, data: object, options?: AxiosRequestConfig): Promise<R> {
    return this.client.post(uri, data, options);
  }

  /**
   * Makes a delete request
   *
   * @param uri   the uri of the endpoint
   */
  public async delete(uri: string): Promise<void> {
    return this.client.delete(uri);
  }

  /**
   * Uploads the {@link FormData} to the URL
   *
   * @param uri       the url to upload to
   * @param formData  the {@link FormData}
   * @param options  the optional extra {@link AxiosRequestConfig} to pass
   */
  public async upload<T>(uri: string, formData: FormData, options?: AxiosRequestConfig): Promise<T> {
    options = {
      ...(await this.getUploadOptions(formData)),
      ...options,
    };

    return this.client.post(uri, formData, options);
  }

  /**
   * Downloads the file to the given directory
   * @param url the url of the file to download
   * @param directory the directory to download to
   * @param config optional {@link AxiosRequestConfig}
   */
  public async download(url: string, directory: string, config?: AxiosRequestConfig): Promise<void> {
    logger.debug(`Downloading ${url} to ${directory}`);

    config = {
      url,
      responseType: 'arraybuffer',
      method: 'GET',
      ...config,
    };

    const dir = path.dirname(directory);
    await fs.mkdirpSync(dir);

    return this.client.request(config).then((buffer) => fs.writeFile(buffer.toString(), directory));
  }

  /**
   * Create the upload configuration
   * @param formData
   */
  /* c8 ignore next */
  private getUploadOptions = async (formData: FormData): Promise<UploadRequestConfig> => {
    if (!this.axiosConfig.auth) {
      throw new TwilioCliError(`Authorization is required to upload a file`);
    }

    const options: UploadRequestConfig = {
      headers: formData.getHeaders(),
    };
    options.headers['Content-Type'] = options.headers['content-type'];

    if (env.isDebug()) {
      const length = await this.getFormDataSize(formData);
      options.adapter = async (config) => {
        let bytes = 0;
        const body = config.data as FormData;
        const uploadReportStream = new Transform({
          transform: (chunk: string | Buffer, _encoding, callback) => {
            bytes += chunk.length;
            const percentage = (bytes / length) * 100;
            logger.debug(`Uploading ${percentage.toFixed(1)}% complete`);
            callback(undefined, chunk);
          },
        });
        if (typeof body.pipe === 'function') {
          body.pipe(uploadReportStream);
        } else {
          uploadReportStream.end(body);
        }
        config.data = uploadReportStream;

        return new Promise((resolve, reject) => {
          httpAdapter(config)
            // @ts-ignore
            .then((resp) => settle(resolve, reject, resp))
            .catch(reject);
        });
      };
    }

    return options;
  };

  /**
   * Calculates the {@link FormData} size
   * @param formData the formData to calculate the size of
   */
  private getFormDataSize = async (formData: FormData): Promise<number> => {
    return new Promise((resolve) => {
      formData.getLength((err, length) => {
        if (err) {
          logger.warning('Failed to calculate upload size');
          resolve(-1);
        } else {
          resolve(length);
        }
      });
    });
  };

  /**
   * Sets up all the request interceptors
   * @param interceptors the interceptors to setup
   * @private
   */
  private useRequestInterceptors(interceptors: RequestInterceptor[]) {
    return async (req: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
      return interceptors.reduce(async (chain, current) => chain.then(current), Promise.resolve(req));
    };
  }

  /**
   * Setups a concurrency on the HTTP requests
   * @param req
   * @private
   */
  private concurrencyRequestTransform = async (req: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const { pending, max } = this.concurrency;
        logger.debug('%s pending HTTP requests - max concurrent requests allowed is %s', pending, max);

        if (pending < max) {
          this.incrementConcurrentRequests();
          clearInterval(interval);
          resolve(req);
          return;
        }

        logger.debug('Reached %s concurrent requests, waiting for requests to resolve', max);
      }, Http.CONCURRENCY_REQUEST_LOOP_MS_DELAY);
    });
  };

  /**
   * Transforms the response object
   * @param resp
   */
  private transformResponse = (resp: AxiosResponse) => {
    this.decrementConcurrentRequests();
    const { data } = resp;

    const servedFromCache = resp.request.fromCache === true ? '(served from cache) ' : '';
    const pretty = Http.prettyPrint(data);
    const url = `${resp.config.baseURL}/${resp.config.url}`;
    const method = resp.request.method || '';
    logger.debug(
      `${method} request to ${url} ${servedFromCache}responded with statusCode ${resp.status} and data\n${pretty}\n`,
    );

    return data;
  };

  /**
   * Transforms the rejection into a Twilio API Error if possible
   * @param err
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private transformResponseError = async (err: any) => {
    this.decrementConcurrentRequests();

    if (Http.isTwilioError(err)) {
      const { data } = err.response;
      logger.debug(`Request errored with data\n${Http.prettyPrint(data)}`);
      return Promise.reject(new TwilioApiError(data.code, data.message, data.status, data.more_info));
    }

    logger.debug(`Request errored with message ${err.message}`);
    return Promise.reject(err);
  };

  /**
   * Increments concurrent request counter
   */
  private incrementConcurrentRequests = () => {
    this.concurrency.pending += 1;
  };

  /**
   * Decrements concurrent request counter
   */
  private decrementConcurrentRequests = () => {
    this.concurrency.pending = Math.max(0, this.concurrency.pending - 1);
  };

  /**
   * Returns a {@link AxiosRequestConfig} configuration
   * @param option  request configuration
   */
  private getRequestOption(option?: RequestOption) {
    const opt: AxiosRequestConfig = {};

    if (!option) {
      return opt;
    }

    if (option.cacheable) {
      opt.cache = {
        maxAge: option.cacheAge || this.cacheAge,
      };
    }

    return opt;
  }
}
