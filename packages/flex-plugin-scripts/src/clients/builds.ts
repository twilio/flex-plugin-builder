/* eslint-disable camelcase */

import { stringify } from 'querystring';

import { logger, TwilioCliError, urlJoin } from '@twilio/flex-dev-utils';
import { isSidOfType, SidPrefix } from '@twilio/flex-dev-utils/dist/sids';

import ServerlessClient from './serverless-client';
import { AssetVersion, FunctionVersion } from './assets';

export enum BuildStatus {
  Building = 'building',
  Completed = 'completed',
  Failed = 'failed',
}

export interface ServerlessBuild {
  sid: string;
  account_sid: string;
  url: string;
  date_updated: string;
  date_created: string;
  status: BuildStatus;
  asset_versions: AssetVersion[];
  function_versions: FunctionVersion[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  dependencies: object;
  service_sid: string;
}

export interface BuildData {
  FunctionVersions: string[];
  AssetVersions: string[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  Dependencies: object;
  Runtime?: string;
}

export default class BuildClient {
  private static NodeEngine = 'node16';

  private static timeoutMsec: number = 60_000;

  private static pollingIntervalMsec: number = 500;

  private readonly client: ServerlessClient;

  private readonly serviceSid: string;

  constructor(client: ServerlessClient, serviceSid: string) {
    if (!isSidOfType(serviceSid, SidPrefix.ServiceSid)) {
      throw new TwilioCliError(`${serviceSid} is not of type ${SidPrefix.ServiceSid}`);
    }

    this.client = client;
    this.serviceSid = serviceSid;
  }

  /**
   * Creates a new {@link Build} and then polls the endpoint once a second until the build is
   * complete.
   *
   * @param data  the build data
   */
  public create = async (data: BuildData): Promise<ServerlessBuild> => {
    return new Promise(async (resolve, reject) => {
      data.Runtime = BuildClient.NodeEngine;
      const newBuild = await this._create(data);
      const { sid } = newBuild;

      const timeoutId = setTimeout(() => {
        /* c8 ignore next */
        // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
        clearInterval(intervalId);
        /* c8 ignore next */
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
  public get = async (sid: string): Promise<ServerlessBuild> => {
    if (!isSidOfType(sid, SidPrefix.BuildSid)) {
      throw new Error(`${sid} is not of type ${SidPrefix.BuildSid}`);
    }

    return this.client.get<ServerlessBuild>(urlJoin('Services', this.serviceSid, 'Builds', sid));
  };

  /**
   * Creates a new instance of build
   *
   * @param data  the {@link BuildData}
   * @private
   */
  private _create = async (data: BuildData): Promise<ServerlessBuild> => {
    return this.client.post<ServerlessBuild>(
      urlJoin('Services', this.serviceSid, 'Builds'),
      { ...data },
      {
        // Serverless does not follow default Twilio API so we need to overwrite the transform here
        /* c8 ignore next */
        transformRequest: () => stringify(data as any),
      },
    );
  };
}
