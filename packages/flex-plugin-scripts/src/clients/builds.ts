import { Credential, logger } from '@twilio/flex-dev-utils';
import { isSidOfType, SidPrefix } from '@twilio/flex-dev-utils/dist/sids';

import BaseClient from './baseClient';
import { Build, BuildStatus } from './serverless-types';
import ServiceClient from './services';

export interface BuildData {
  FunctionVersions: string[];
  AssetVersions: string[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  Dependencies: object;
  Runtime?: string;
}

export default class BuildClient extends BaseClient {
  public static BaseUri = 'Builds';

  private static timeoutMsec: number = 60000;

  private static pollingIntervalMsec: number = 500;

  constructor(auth: Credential, serviceSid: string) {
    super(auth, `${ServiceClient.getBaseUrl()}/Services/${serviceSid}`);

    if (!isSidOfType(serviceSid, SidPrefix.ServiceSid)) {
      throw new Error(`ServiceSid ${serviceSid} is not valid`);
    }
  }

  /**
   * Creates a new {@link Build} and then polls the endpoint once a second until the build is
   * complete.
   *
   * @param data  the build data
   */
  public create = async (data: BuildData): Promise<Build> => {
    return new Promise(async (resolve, reject) => {
      data.Runtime = 'node14';
      const newBuild = await this._create(data);
      const { sid } = newBuild;

      const timeoutId = setTimeout(() => {
        // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
        clearInterval(intervalId);
        reject('Timeout while waiting for new Twilio Runtime build status to change to complete.');
      }, BuildClient.timeoutMsec);

      const intervalId = setInterval(async () => {
        logger.debug('Checking Serverless Build status');

        const build = await this.get(sid);
        logger.debug('Build status is', build.status);

        if (build.status === BuildStatus.Failed) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);

          reject('Twilio Runtime build has failed.');
        }

        if (build.status === BuildStatus.Completed) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);

          resolve(build);
        }
      }, BuildClient.pollingIntervalMsec);
    });
  };

  /**
   * Fetches a build by buildSid
   *
   * @param sid  the build sid to fetch
   */
  public get = async (sid: string): Promise<Build> => {
    if (!isSidOfType(sid, SidPrefix.BuildSid)) {
      throw new Error(`${sid} is not of type ${SidPrefix.BuildSid}`);
    }

    return this.http.get<Build>(`${BuildClient.BaseUri}/${sid}`);
  };

  /**
   * Creates a new instance of build
   *
   * @param data  the build data
   * @private
   */
  private _create = async (data: BuildData): Promise<Build> => {
    return this.http.post<Build>(BuildClient.BaseUri, data);
  };
}
