/* eslint-disable import/order */
import MockAdapter from 'axios-mock-adapter';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

// @ts-ignore
import httpAdapter from 'axios/lib/adapters/http';
// @ts-ignore
import settle from 'axios/lib/core/settle';

export default axios;
export { AxiosRequestConfig, AxiosInstance, MockAdapter, httpAdapter, settle };
