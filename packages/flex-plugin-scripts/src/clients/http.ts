import axios, { AxiosInstance } from 'flex-dev-utils/dist/axios';
import { stringify } from 'querystring';
import { format } from 'util';
import { logger } from 'flex-dev-utils';
import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import FormData from 'form-data';

export interface HttpConfig {
  baseURL: string;
  auth: AuthConfig;
  exitOnRejection?: boolean;
}

export default class Http {
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
      return 'application/json';
    }

    return 'application/octet-stream';
  }

  protected readonly client: AxiosInstance;
  private readonly config: HttpConfig;

  constructor(config: HttpConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      auth: {
        username: config.auth.accountSid,
        password: config.auth.authToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.client.interceptors.response.use((r) => r, this.onError);
  }

  /**
   * List API endpoint; makes a GET request and returns an array of R
   * @param uri   the uri endpoint
   */
  public list<R>(uri: string): Promise<R[]> {
    return this.get<R[]>(uri);
  }

  /**
   * Makes a GET request to return an instance
   * @param uri   the uri endpoint
   */
  public get<R>(uri: string): Promise<R> {
    logger.trace('Making GET request to %s/%s', this.config.baseURL, uri);

    return this.client
      .get(uri)
      .then((resp) => resp.data || {});
  }

  /**
   * Makes a POST request
   * @param uri   the uri of the endpoint
   * @param data  the data to post
   */
  public post<R>(uri: string, data: any): Promise<R> {
    logger.trace('Making POST request to %s/%s with data %s', this.config.baseURL, uri, JSON.stringify(data));

    return this.client
      .post(uri, stringify(data))
      .then((resp) => resp.data);
  }

  /**
   * Makes a delete request
   *
   * @param uri   the uri of the endpoint
   */
  public delete(uri: string): Promise<void> {
    logger.trace('Making DELETE request to %s/%s', this.config.baseURL, uri);

    return this.client
      .delete(uri);
  }

  /**
   * Uploads the {@link FormData} to the URL
   *
   * @param url       the url to upload to
   * @param formData  the {@link FormData}
   */
  public upload = (url: string, formData: FormData): Promise<any> => {
    logger.trace('Uploading to %s with formData %s', url, formData);

    return axios
      .post(url, formData, {
        headers: formData.getHeaders(),
        auth: {
          username: this.config.auth.accountSid,
          password: this.config.auth.authToken,
        },
      })
      .then((resp) => resp.data)
      .catch(this.onError);
  }

  /**
   * Private error handler
   * @param err Axios error
   */
  private onError = (err: any): Promise<any> => {
    const request = err.config || {};
    const resp = err.response || {};
    const status = resp.status;
    const msg = resp.data && resp.data.message || resp.data;
    const title = 'Request %s to %s failed with status %s and message %s';
    const errMsg = format(title, request.method, request.url, status, msg);

    if (this.config.exitOnRejection) {
      throw new Error(errMsg);
    } else {
      return Promise.reject(err);
    }
  }
}
