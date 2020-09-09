declare module '@twilio/cli-core' {
  import { ConfigData, ConfigDataProfile } from '@twilio/cli-core/src/services/config';
  import { SecureStorage } from '@twilio/cli-core/src/services/secure-storage';
  import { TwilioApiClient } from '@twilio/cli-core/src/services/twilio-api/twilio-client';
  import Twilio from 'twilio';
  import { Command } from '@oclif/command';

  class TwilioClientCommand extends Command {
    protected showHeaders: boolean;
    protected twilioClient: Twilio;
    protected twilioApiClient: typeof TwilioApiClient;
    protected currentProfile: typeof ConfigDataProfile;
    protected logger: {
      error: (...messages: string[]) => void;
      warning: (...messages: string[]) => void;
    };

    constructor(argv: string[], config: typeof ConfigData, secureStorage: typeof SecureStorage);

    public run(): Promise<void>;
  }

  declare const baseCommands: {
    TwilioClientCommand: typeof TwilioClientCommand;
  };

  declare const services: {
    config: {
      ConfigData: typeof ConfigData;
    };
    secureStorage: {
      SecureStorage: typeof SecureStorage;
    }
  }

  export { baseCommands, services };
}

declare module '@twilio/cli-test' {
  import { baseCommands } from '@twilio/cli-core';
  import { Logger } from 'flex-plugins-utils-logger';
  import { ConfigData, Config } from '@twilio/cli-core/src/services/config';
  import { expect } from 'chai';
  import { FancyTypes } from 'fancy-test';
  import { test } from '@oclif/test';

  type TestCmd = {
    testCmd?: typeof baseCommands.TwilioClientCommand & {
      _logger: Logger;
    };
    variables: Record<string, unknown>;
  };


  type TwilioCliTest<C extends TwilioClientCommand> = FancyTypes.Base<FancyTypes.Context & TestCmd, {
    twilioFakeProfile: {
      output: {
        userConfig: typeof ConfigData;
      };
      args: [typeof ConfigData];
    };
  } & {
    twilioCliEnv: {
      output: {
        config: typeof Config;
      };
      args: [typeof Config];
    };
  } & {
    twilioCreateCommand: {
      output: {
        testCmd: C;
      };
      args: [C, string[]];
    };
  }> & typeof test;

  declare const twilioCliTest: FancyTypes.Base<FancyTypes.Context & TestCmd, {
    twilioFakeProfile: {
      output: {
        configData: typeof ConfigData;
      };
      args: [typeof ConfigData];
    };
  } & {
    twilioCliEnv: {
      output: {
        config: typeof Config;
      };
      args: [typeof Config];
    };
  } & {
    twilioCreateCommand: {
      output: {
        testCmd: typeof baseCommands.TwilioClientCommand;
      };
      args: [baseCommands.TwilioClientCommand, string[]];
    };
  }> & typeof test;

  export { expect, twilioCliTest as test  };
}

declare module '@twilio/cli-core/src/services/config' {
  import { ConfigData, Config, ConfigDataProfile } from '@twilio/cli-core/src/services/config';

  export { Config, ConfigData, ConfigDataProfile }
}
