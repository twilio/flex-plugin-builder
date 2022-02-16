import { stringify } from 'querystring';
import { format } from 'util';
import { Transform } from 'stream';

import axios, { AxiosInstance, AxiosRequestConfig, httpAdapter, settle } from '@twilio/flex-dev-utils/dist/axios';
import { logger, env, Credential } from '@twilio/flex-dev-utils';
import FormData from 'form-data';

const applicationUrlEncoded = 'application/x-www-form-urlencoded';
const applicationJson = 'application/json';
export type ContentType = 'application/x-www-form-urlencoded' | 'application/json';
export interface HttpConfig {
  baseURL: string;
  userAgent?: string;
  auth: Credential;
  exitOnRejection?: boolean;
  contentType?: ContentType;
}

interface UploadRequestConfig extends AxiosRequestConfig {
  headers: Record<string, string>;
  auth: {
    username: string;
    password: string;
  };
}

export default class Http {
  protected readonly client: AxiosInstance;

  private readonly config: HttpConfig;

  private readonly jsonPOST: boolean;

  constructor(config: HttpConfig) {
    this.config = config;
    this.jsonPOST = config.contentType === applicationJson;
    this.client = axios.create({
      baseURL: config.baseURL,
      auth: {
        username: config.auth.username,
        password: config.auth.password,
      },
      headers: {
        'Content-Type': config.contentType ? config.contentType : applicationUrlEncoded,
      },
    });

    if (config.userAgent) {
      this.client.defaults.headers['User-Agent'] = config.userAgent;
    }

    this.client.interceptors.response.use((r) => r, this.onError);
  }

  /**
   * Determines the content type based on file extension
   *
   * @param filePath  the local path to the file
   * @returns the content type
   */
  public static getContentType = (filePath: string): string => {
    const ext = filePath.split('.').pop();

    if (ext === 'js') {
      return 'application/javascript';
    } else if (ext === 'map') {
      return applicationJson;
    }

    return 'application/octet-stream';
  };

  /**
   * List API endpoint; makes a GET request and returns an array of R
   * @param uri   the uri endpoint
   */
  public async list<R>(uri: string): Promise<R[]> {
    return this.get<R[]>(uri);
  }

  /**
   * Makes a GET request to return an instance
   * @param uri   the uri endpoint
   */
  public async get<R>(uri: string): Promise<R> {
    logger.debug('Making GET request to %s/%s', this.config.baseURL, uri);

    return this.client.get(uri).then((resp) => resp.data || {});
  }

  /**
   * Makes a POST request
   * @param uri   the uri of the endpoint
   * @param data  the data to post
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async post<R>(uri: string, data: any): Promise<R> {
    logger.debug('Making POST request to %s/%s with data %s', this.config.baseURL, uri, JSON.stringify(data));
    if (!this.jsonPOST) {
      data = stringify(data);
    }

    return this.client.post(uri, data).then((resp) => resp.data);
  }

  /**
   * Makes a delete request
   *
   * @param uri   the uri of the endpoint
   */
  public async delete(uri: string): Promise<void> {
    logger.debug('Making DELETE request to %s/%s', this.config.baseURL, uri);

    return this.client.delete(uri);
  }

  /**
   * Uploads the {@link FormData} to the URL
   *
   * @param url       the url to upload to
   * @param formData  the {@link FormData}
   */
  public upload = async <T>(url: string, formData: FormData): Promise<T> => {
    logger.debug('Uploading formData to %s', url);
    logger.trace(formData);

    const options: AxiosRequestConfig = await this.getUploadOptions(formData);

    return axios
      .post(url, formData, options)
      .then((resp) => resp.data)
      .catch(this.onError);
  };

  /**
   * Create the upload configuration
   * @param formData
   */
  /* istanbul ignore next */
  private getUploadOptions = async (formData: FormData): Promise<UploadRequestConfig> => {
    const options: UploadRequestConfig = {
      headers: formData.getHeaders(),
      auth: {
        username: this.config.auth.username,
        password: this.config.auth.password,
      },
    };
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
   * Private error handler
   * @param err Axios error
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onError = async (err: any): Promise<string | Error> => {
    logger.trace('Http request failed', err);

    if (this.config.exitOnRejection) {
      const request = err.config || {};
      const resp = err.response || {};
      const { status } = resp;
      const msg = (resp.data && resp.data.message) || resp.data;
      const title = 'Request %s to %s failed with status %s and message %s';
      const errMsg = format(title, request.method, request.url, status, msg);

      throw new Error(errMsg);
    } else {
      return Promise.reject(err);
    }
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
}
