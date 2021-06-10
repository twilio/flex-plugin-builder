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
    envVarText: string;
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

// These are required parameters - verify otherwise throw an error
const requiredEnvs = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'CONSOLE_EMAIL', 'CONSOLE_PASSWORD'];
requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`${env} is required`);
  }
});

// Export parameters for use
export const homeDir = `${process.env.HOME as string}/.local`;
export const testParams: TestParams = {
  environment: {
    __hidden: false,
    path: process.env.PATH as string,
    nodeVersion: process.env.NODE_VERSION as string,
    homeDir,
  },
  secrets: {
    __hidden: true,
    console: {
      email: process.env.CONSOLE_EMAIL as string,
      password: process.env.CONSOLE_PASSWORD as string,
    },
    api: {
      accountSid: process.env.TWILIO_ACCOUNT_SID as string,
      authToken: process.env.TWILIO_AUTH_TOKEN as string,
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
      dir: `${homeDir}/${pluginName}`,
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
