import qs from 'qs';
import { setupCache } from 'axios-cache-adapter';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from 'flex-plugins-utils-env';
import logger from 'flex-plugins-utils-logger/dist/lib/logger';
import { TwilioApiError } from 'flex-plugins-utils-exception';

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
  requestInterceptors?: [RequestInterceptor];
  maxConcurrentRequests?: number;
}

export interface HttpConfig extends OptionalHttpConfig {
  baseURL: string;
}

export default class Http {
  static DEFAULT_CONCURRENT_REQUESTS = 5;

  static CONCURRENCY_REQUEST_LOOP_MS_DELAY = 100;

  static ContentType = 'application/x-www-form-urlencoded';

  static UserAgent = 'User-Agent';

  protected readonly client: AxiosInstance;

  protected readonly cacheAge: number;

  protected readonly concurrency: Concurrency;

  constructor(config: HttpConfig) {
    this.cacheAge = 15 * 60 * 1000;
    const cache = setupCache({ maxAge: 0 });

    const axiosConfig: AxiosRequestConfig = {
      baseURL: config.baseURL,
      headers: {
        'Content-Type': Http.ContentType,
        ...config.headers,
      },
      adapter: cache.adapter,
    };
    if (config.auth) {
      axiosConfig.auth = {
        username: config.auth.username,
        password: config.auth.password,
      };
    }
    if (config.setUserAgent) {
      /* istanbul ignore next */
      if (!axiosConfig.headers) {
        axiosConfig.headers = {};
      }
      axiosConfig.headers[Http.UserAgent] = Http.getUserAgent(config);
    }
    this.client = axios.create(axiosConfig);

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
   * Calculates and returns the User-Agent header
   * @param config
   */
  private static getUserAgent(config: HttpConfig) {
    const packages = config.packages || {};
    // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const pkg = require('../package.json');
    packages[pkg.name] = pkg.version;

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
      req.headers?.['Content-Type'] === Http.ContentType &&
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
    }

    return Promise.resolve(req);
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
  public async post<R>(uri: string, data: object): Promise<R> {
    return this.client.post(uri, data);
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
