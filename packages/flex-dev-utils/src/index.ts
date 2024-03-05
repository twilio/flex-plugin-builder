/* eslint-disable import/no-unused-modules */

import urlJoin from 'url-join';

export { default as fs } from './fs';
export { default as lodash } from './lodash';
export { default as updateNotifier, checkForUpdate } from './updateNotifier';
export { HttpClient, HttpClientConfig, OptionalHttpClientConfig, Pagination, PaginationMeta, Meta } from './http';
export { logger, Logger, coloredStrings, chalk, table, boxen, singleLineString, multilineString } from './logger';
export { progress } from './progress';
export { default as credentials, Credential, getCredential } from './credentials';
export { default as keychain, KeychainCredential, Keychain } from './keychain';
export { default as sids } from './sids';
export { default as random } from './random';
export { default as validators } from './validators';
export { default as prints } from './prints';
export { default as open } from './open';
export {
  default as errors,
  FlexPluginError,
  ValidationError,
  UserActionError,
  TwilioError,
  TwilioApiError,
  NotImplementedError,
  TwilioCliError,
} from './errors';
export { default as runner } from './runner';
export { default as urls } from './urls';
export { default as env } from './env';
export { getPaths as paths } from './fs';
export { default as semver, ReleaseType, SemVer, versionSatisfiesRange } from './semver';
export { default as exit } from './exit';
export { inquirer, prompt, confirm, choose, Question } from './questions';

export type FunctionalCallback<D, R> = (data: D) => R;
export type Callback<D> = FunctionalCallback<D, void>;

export * as spawn from './spawn';
export * as packages from './packages';

export { default as FormData } from 'form-data';
export { default as axios } from './axios';
export { urlJoin };
export { Telemetry } from './telemetry';
