import { join } from 'path';
import { platform } from 'os';

import semver from 'semver';

import { ConsoleAuthOptions } from '../utils';

interface Hidden {
  __hidden: boolean;
}

export interface PluginType {
  name: string;
  dir: string;
  componentText: string;
  localhostUrl: string;
}

export interface TestScenario {
  packageVersion: string;
  plugins: (PluginType &
    Partial<{
      newlineValue: string;
      changelog: string;
      version: string;
    }>)[];
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
    start: {
      timeout: number;
      pollInterval: number;
    };
    consoleBaseUrl: string;
    hostedFlexBaseUrl: string;
    localhostPort: number;
    region?: string;
    regionFlag: string[];
  } & Hidden;
  scenario: TestScenario & Hidden;
}

const { TWILIO_REGION, LOCALHOST_PORT } = process.env;
const pluginName = 'flex-e2e-tester-plugin';
const pluginName2 = 'flex-e2e-tester-plugin-2';
const pluginName3 = 'flex-e2e-tester-plugin-3';
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
    start: {
      timeout: 30000,
      pollInterval: 1000,
    },
    __hidden: false,
    consoleBaseUrl: process.env.CONSOLE_BASE_URL || consoleBaseUrl,
    hostedFlexBaseUrl: process.env.HOSTED_FLEX_BASE_URL || hostedFlexBaseUrl,
    region: TWILIO_REGION || '',
    regionFlag: [],
    localhostPort: Number(LOCALHOST_PORT) || 3000,
  },
  scenario: {
    __hidden: false,
    packageVersion: process.env.PACKAGE_VERSION as string,
    plugins: [
      {
        name: pluginName,
        dir: join(homeDir, pluginName),
        componentText: `This is a dismissible demo component ${Date.now()}`,
        localhostUrl: 'http://localhost:3000' || (process.env.PLUGIN_BASE_URL as string),
      },
      {
        name: pluginName2,
        dir: join(homeDir, pluginName2),
        componentText: `This is a dismissible demo component for plugin2 ${Date.now()}`,
        localhostUrl: 'http://localhost:3000' || (process.env.PLUGIN_BASE_URL as string),
      },
      {
        name: pluginName3,
        dir: join(homeDir, pluginName3),
        componentText: `This is a dismissible demo component for plugin3 ${Date.now()}`,
        localhostUrl: 'http://localhost:3000' || (process.env.PLUGIN_BASE_URL as string),
      },
    ],
  },
};

// Set the region
if (testParams.config.region) {
  testParams.config.regionFlag.push('--region', testParams.config.region);
}

// Overwrite flexUIVersion
if (process.env.FLEX_UI_VERSION && semver.valid(process.env.FLEX_UI_VERSION)) {
  testParams.scenario.flexUIVersion = process.env.FLEX_UI_VERSION as string;
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
