import { join } from 'path';
import { platform } from 'os';

import { ConsoleAuthOptions } from '../utils';

interface Hidden {
  __hidden: boolean;
}

export interface TestScenario {
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
}

export interface TestParams {
  environment: {
    nodeVersion: string;
    homeDir: string;
    path: string;
    operatingSystem: string;
    cwd: string;
    ignorePrefix: boolean;
  } & Hidden;
  secrets: {
    console: ConsoleAuthOptions;
    api: {
      accountSid: string;
      authToken: string;
    };
  } & Hidden;
  config: {
    consoleBaseUrl: string;
    hostedFlexBaseUrl: string;
    region?: string;
    regionFlag: string[];
  } & Hidden;
  scenario: TestScenario & Hidden;
}

const { TWILIO_REGION } = process.env;
const pluginName = 'flex-e2e-tester-plugin';
const consoleBaseUrl = TWILIO_REGION ? `https://www.${TWILIO_REGION}.twilio.com` : 'https://www.twilio.com';
const hostedFlexBaseUrl = TWILIO_REGION ? `https://flex.${TWILIO_REGION}.twilio.com` : 'https://flex.twilio.com';
const operatingSystem = platform();

const consoleEmail = `CONSOLE_EMAIL_${operatingSystem}`;
const accountSid = `TWILIO_ACCOUNT_SID_${operatingSystem}`;
const authToken = `TWILIO_AUTH_TOKEN_${operatingSystem}`;

// These are required parameters - verify otherwise throw an error
const requiredEnvs = [accountSid, authToken, consoleEmail, 'CONSOLE_PASSWORD'];
requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`${env} is required`);
  }
});

// Export parameters for use
export const homeDir = join(process.env.HOME as string, '.local');

export const testParams: TestParams = {
  environment: {
    __hidden: false,
    path: process.env.PATH as string,
    nodeVersion: process.env.NODE_VERSION as string,
    homeDir,
    operatingSystem,
    cwd: process.cwd(),
    ignorePrefix: process.env.NPM_IGNORE_PREFIX === 'true' || false,
  },
  secrets: {
    __hidden: true,
    console: {
      email: process.env[consoleEmail] as string,
      password: process.env.CONSOLE_PASSWORD as string,
    },
    api: {
      accountSid: process.env[accountSid] as string,
      authToken: process.env[authToken] as string,
    },
  },
  config: {
    __hidden: false,
    consoleBaseUrl: process.env.CONSOLE_BASE_URL || consoleBaseUrl,
    hostedFlexBaseUrl: process.env.HOSTED_FLEX_BASE_URL || hostedFlexBaseUrl,
    region: TWILIO_REGION || '',
    regionFlag: [],
  },
  scenario: {
    __hidden: false,
    packageVersion: process.env.PACKAGE_VERSION as string,
    plugin: {
      name: pluginName,
      dir: join(homeDir, pluginName),
      componentText: `This is a dismissible demo component ${Date.now()}`,
      localhostUrl: 'http://localhost:3000' || (process.env.PLUGIN_BASE_URL as string),
    },
  },
};
if (testParams.config.region) {
  testParams.config.regionFlag.push('--region', testParams.config.region);
}

// All test scenarios to run
export const testScenarios: Partial<TestScenario>[] = [
  {
    isTS: false,
  },
  {
    isTS: true,
  },
];
