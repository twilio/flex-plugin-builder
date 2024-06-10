import * as os from 'os';
import { join } from 'path';

import daemonizeProcess from 'daemonize-process';
import Analytics, { TrackParams } from '@segment/analytics-node';

import { PRODUCT, SOURCE, DEV_VALUE, PROD_VALUE, STAGE_VALUE } from './constants';
import * as fs from '../../fs';
import { env } from '../../env';

interface OsDetail {
  osType: string;
  osName: string;
  osVersion: string;
}
interface CommonProperties {
  product: string;
  source: string;
  realm: string;
  flexUserRole: string;
  pluginName: string;
  pluginVersion: string;

  // Below are System Properties
  locale: string | undefined;
  osDetail: OsDetail;
  timezone: string;
  typescript: boolean;
  nodeVersion: string;
  flexUiVersion: string;
}

const getKey = (): string => {
  const region: string = env.getRegion();
  if (region === 'stage') {
    return STAGE_VALUE;
  } else if (region === 'dev') {
    return DEV_VALUE;
  }
  return PROD_VALUE;
};

export const track = (payload: TrackParams): void => {
  const analytics = new Analytics({ writeKey: getKey(), flushAt: 1 });
  analytics.track(payload);
};

type TelemetryOpts = {
  /**
   * If set to `true` calls Segment APIs in a daemon process asynchronously
   */
  runAsync?: boolean;
};

export default class Telemetry {
  private commonProperties: CommonProperties;

  private runAsync: boolean;

  /**
   * Creates an analytics instance
   *
   */
  constructor({ runAsync = true }: TelemetryOpts = {}) {
    this.runAsync = runAsync;
    const { env } = process;
    const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
    let pluginName = 'n/a';
    let pluginVersion = 'n/a';
    let typescript = false;
    let flexUiVersion = 'n/a';

    if (fs.isPluginFolder()) {
      pluginName = fs.getPaths().app.name;
      pluginVersion = fs.getPaths().app.version;
      typescript = fs.getPaths().app.isTSProject();
      flexUiVersion = fs.getPackageVersion(`@twilio/flex-ui`);
    }

    this.commonProperties = {
      product: PRODUCT,
      source: SOURCE,
      realm: this.getRealm(),
      flexUserRole: 'admin',
      pluginName,
      pluginVersion,
      locale: language,
      osDetail: this.getOsDetails(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      typescript,
      nodeVersion: process.version.slice(1),
      flexUiVersion,
    };
  }

  /**
   * Records any event or actions that users perform.
   * @param event Event name
   * @param properties Event properties
   */
  public track(event: string, accountSid: string, properties?: Record<string, any>): void {
    const payload: TrackParams = {
      userId: accountSid,
      event,
      properties: {
        ...this.commonProperties,
        accountSid,
        ...properties,
      },
    };

    if (!env.isCI()) {
      // Fork a new process for the daemon
      if (this.runAsync) {
        daemonizeProcess({
          script: join(__dirname, 'track.js'),
          arguments: [JSON.stringify(payload)],
        });
      } else {
        track(payload);
      }
    }
  }

  private getOsDetails(): OsDetail {
    return {
      osType: os.type(),
      osName: os.platform(),
      osVersion: os.release(),
    };
  }

  private getRealm(): string {
    const region = env.getRegion();
    if (region === 'stage') {
      return 'stage-us1';
    } else if (region === 'dev') {
      return 'dev-us1';
    }
    return 'us1';
  }
}
