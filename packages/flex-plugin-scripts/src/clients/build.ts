import { AuthConfig } from "./auth";
import BaseClient from "./baseClient";
import { Build, BuildStatus } from "./serverless-types";
import ServiceClient from "./services";

export interface BuildData {
  FunctionVersions: Array<string>;
  AssetVersions: Array<string>;
  Dependencies: object;
}

export default class BuildClient extends BaseClient {
  private static timeoutMsec: number = 30000;
  private static pollingIntervalMsec: number = 500;

  constructor(auth: AuthConfig, serviceSid: string) {
    super(auth,  `${ServiceClient.baseUrl}/Services/${serviceSid}`);
  }

  /**
   * Creates a new {@link Build} and then polls the endpoint once a second until the build is
   * complete.
   *
   * @param data  the build data
   */
  public create = (data: BuildData): Promise<Build> => {
    return new Promise(async (resolve, reject) => {
      const build = await this._create(data);
      const sid = build.sid;

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        reject('Timeout while waiting for new Build status to change to complete.');
      }, BuildClient.timeoutMsec);

      const intervalId = setInterval(async () => {
        const build = await this.get(sid);

        if (build.status === BuildStatus.Failed) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);

          reject('New Runtime build has failed.');
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
   * @param buildSid  the build sid to fetch
   */
  public get = (buildSid: string): Promise<Build> => {
    return this.http
      .get<Build>(`Builds/${buildSid}`);
  };

  /**
   * Creates a new instance of build
   *
   * @param data  the build data
   * @private
   */
  private _create = (data: BuildData): Promise<Build> => {
    return this.http
      .post<Build>('Builds', data);
  };
}
