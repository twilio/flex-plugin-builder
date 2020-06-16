import { baseCommands } from '@twilio/cli-core';
import CreateFlexPlugin from 'create-flex-plugin';
import { flags } from '@oclif/command';
import { Options } from 'yargs';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

interface YArgs {
  [key: string]: Options;
}

/**
 * Creates a new Flex plugin
 */
export default class FlexPluginsCreate extends baseCommands.TwilioClientCommand {
  static description = createDescription(CreateFlexPlugin.description);

  static flags = {
    ...FlexPluginsCreate.parseYargs(CreateFlexPlugin.flags),
  };

  static args = [
    {
      name: 'name',
      required: true,
      description: CreateFlexPlugin.description,
    },
  ];

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage);

    this.showHeaders = true;
  }

  /**
   * Converts yArgs to OClif flags
   *
   * @param yargs   the yargs flags
   * @returns the OClif args
   */
  static parseYargs(yargs: YArgs) {
    return Object.keys(yargs).reduce((result, key) => {
      const arg = yargs[key];
      const flagType = arg.type || 'string';

      result[key] = flags[flagType]({
        char: arg.alias,
        description: arg.describe,
        default: arg.default,
        required: false,
      });

      return result;
    }, {});
  }

  /**
   * Converts args to arvg array
   *
   * @param args      the args
   * @returns {Array}
   */
  static toArgv(args: string[]) {
    return Object.keys(args).reduce((result: string[], key: string) => {
      result.push(`--${key}`, args[key]);

      return result;
    }, []);
  }

  /**
   * Main script to run
   *
   * @returns {Promise<void>}
   */
  async run() {
    const { flags: instanceFlags, args } = this.parse(FlexPluginsCreate);
    const createFlexPlugin = new CreateFlexPlugin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scriptArgs = FlexPluginsCreate.toArgv(instanceFlags as any);
    scriptArgs.unshift(args.name);

    await createFlexPlugin.parse(...scriptArgs);
  }

  async runCommand() {
    return this.run();
  }
}
