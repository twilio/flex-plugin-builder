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
