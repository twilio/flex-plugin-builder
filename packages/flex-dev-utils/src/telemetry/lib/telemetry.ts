import * as os from 'os';
import * as fs from '../../fs';
import { env } from '../../env';
import daemonizeProcess from 'daemonize-process';
import { join } from 'path';

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

const PRODUCT = 'Flex';
const SOURCE = 'flexpluginscli';

export const trackEventName = 'PCLI Run';

export default class Telemetry {
  private commonProperties: CommonProperties;

  /**
   * Creates an analytics instance
   *
   */
  constructor() {
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
    const traceData = {
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
      daemonizeProcess({
        script: join(__dirname, 'track.js'),
        arguments: [JSON.stringify(traceData)],
      });
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
