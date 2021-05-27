import { ConsoleAuthOptions } from '../utils';

interface Hidden {
  __hidden: boolean;
}

export interface TestParams {
  environment: {
    nodeVersion: string;
    homeDir: string;
  } & Hidden;
  secrets: {
    console: ConsoleAuthOptions;
  } & Hidden;
  config: {
    consoleBaseUrl: string;
    hostedFlexBaseUrl: string;
    region?: string;
    regionFlag: string[];
  } & Hidden;
  scenario: {
    packageVersion: string;
    plugin: {
      name: string;
      dir: string;
      componentText: string;
      localhostUrl: string;
    } & Partial<{
      newlineValue: string;
      changelog: string;
      version: string;
    }>;
    flexUIVersion?: string;
    reactVersion?: string;
    isTS?: boolean;
  } & Hidden;
}

const { TWILIO_REGION } = process.env;
const pluginName = 'flex-e2e-tester-plugin';
const consoleBaseUrl = TWILIO_REGION ? `https://www.${TWILIO_REGION}.twilio.com` : 'https://www.twilio.com';
const hostedFlexBaseUrl = TWILIO_REGION ? `https://flex.${TWILIO_REGION}.twilio.com` : 'https://flex.twilio.com';

// Export parameters for use
export const homeDir = `${process.env.HOME as string}/.local`;
export const testParams: TestParams = {
  environment: {
    __hidden: false,
    nodeVersion: process.env.NODE_VERSION as string,
    homeDir,
  },
  secrets: {
    __hidden: true,
    console: {
      email: process.env.CONSOLE_EMAIL,
      password: process.env.CONSOLE_PASSWORD,
    },
  },
  config: {
    __hidden: false,
    consoleBaseUrl: process.env.CONSOLE_BASE_URL || consoleBaseUrl,
    hostedFlexBaseUrl: process.env.HOSTED_FLEX_BASE_URL || hostedFlexBaseUrl,
    region: TWILIO_REGION,
    regionFlag: [],
  },
  scenario: {
    __hidden: false,
    packageVersion: process.env.PACKAGE_VERSION as string,
    plugin: {
      name: pluginName,
      dir: `${homeDir}/${pluginName}`,
      componentText: `This is a dismissible demo component ${Date.now()}`,
      localhostUrl: 'http://localhost:3000' || (process.env.PLUGIN_BASE_URL as string),
    },
  },
};
if (testParams.config.region) {
  testParams.config.regionFlag.push('--region', testParams.config.region);
}
