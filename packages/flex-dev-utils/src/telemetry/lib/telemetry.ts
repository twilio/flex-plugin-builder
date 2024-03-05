import * as os from 'os';

import Analytics from '@segment/analytics-node';

import { getPackageVersion, getPaths, isPluginFolder } from '../../fs';
import { logger } from '../../logger';
import { env } from '../../env';
import { DEV_VALUE, PROD_VALUE, STAGE_VALUE } from './constants';

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
  protected readonly analytics: Analytics;

  private commonProperties: CommonProperties;

  /**
   * Creates an analytics instance
   *
   */
  constructor() {
    const { env } = process;
    const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
    this.analytics = new Analytics({ writeKey: this.getKey() });

    let pluginName = 'n/a';
    let pluginVersion = 'n/a';
    let typescript = false;
    let flexUiVersion = 'n/a';

    if (isPluginFolder()) {
      pluginName = getPaths().app.name;
      pluginVersion = getPaths().app.version;
      typescript = getPaths().app.isTSProject();
      flexUiVersion = getPackageVersion(`@twilio/flex-ui`);
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
    logger.warning(`trace data is ${JSON.stringify(traceData)}`);
    this.analytics.track(traceData);
  }

  private getOsDetails(): OsDetail {
    return {
      osType: os.type(),
      osName: os.platform(),
      osVersion: os.release(),
    };
  }

  private getKey(): string {
    const region = env.getRegion();
    if (region === 'stage') {
      return STAGE_VALUE;
    } else if (region === 'dev') {
      return DEV_VALUE;
    }
    return PROD_VALUE;
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
