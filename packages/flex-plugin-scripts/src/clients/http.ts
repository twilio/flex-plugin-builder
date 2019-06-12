import axios, { AxiosInstance } from "axios";
import { readFileSync } from "fs";
import { stringify } from 'querystring';
import { format } from "util";

import { AuthConfig } from "./auth";
import * as logger from '../utils/logger';

export interface HttpConfig {
  baseURL: string;
  auth: AuthConfig;
  exitOnRejection?: boolean;
}

export default class Http {
  private readonly config: HttpConfig;
  private readonly client: AxiosInstance;

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


    this.client.interceptors.response.use(r => r, this.onError);
  }

  public list<R>(uri: string): Promise<Array<R>> {
    return this.get<Array<R>>(uri);
  }

  public get<R>(uri: string): Promise<R> {
    logger.trace('Making GET request to %s/%s', this.config.baseURL, uri);

    return this.client
      .get(uri)
      .then(resp => resp.data || {});
  }

  public post<R>(uri: string, data: any): Promise<R> {
    logger.trace('Making POST request to %s/%s with data %s', this.config.baseURL, uri, JSON.stringify(data));

    return this.client
      .post(uri, stringify(data))
      .then(resp => resp.data);
  }

  public uploadToS3(filePath: string, url: string, kmsARN: string): Promise<any> {
    logger.trace('Uploading to S3 with presigned URL %s', url);

    const ext = filePath.split('.').pop();
    let contentType = 'application/octet-stream';
    if (ext === 'js') {
      contentType = 'application/javascript';
    } else if (ext === 'map') {
      contentType = 'application/json';
    }

    return axios
      .put(url, readFileSync(filePath, 'utf8'), {
        headers: {
          'Content-Type': contentType,
          'X-Amz-Server-Side-Encryption': 'aws:kms',
          'X-Amz-Server-Side-Encryption-Aws-Kms-Key-Id': kmsARN,
        },
      })
      .then(resp => resp.data)
      .catch(this.onError)
  }

  private onError = (err: any): Promise<any> => {
    const request = err.config;
    const resp = err.response;
    const status = resp.status;
    const msg = resp.data && resp.data.message || resp.data;
    const errMsg = format('Request %s to %s failed with status %s and message %s', request.method, request.url, status, msg);

    if (this.config.exitOnRejection) {
      throw new Error(errMsg);
    } else {
      return Promise.reject(err);
    }
  }
}
