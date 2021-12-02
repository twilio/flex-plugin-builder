import { baseCommands } from '@twilio/cli-core';
import CreateFlexPlugin from 'create-flex-plugin';
import { flags } from '@oclif/command';
import { Options } from 'yargs';
import { TwilioCliError } from 'flex-dev-utils';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

interface YArgs {
  [key: string]: Options;
}

/**
 * Creates a new Flex plugin
 */
// @ts-ignore
// eslint-disable-next-line import/no-unused-modules
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
  static parseYargs(yargs: YArgs): YArgs {
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
  static toArgv(args: string[]): string[] {
    return Object.keys(args).reduce((result: string[], key: string) => {
      result.push(`--${key}`, args[key]);

      return result;
    }, []);
  }

  /**
   *
   * @param argv the argv
   * @returns the edited argv array
   */
  static editArgv(argv: string[]): string[] {
    if (argv.includes('--flexui2.0') && argv.includes('--flexui1.0')) {
      throw new TwilioCliError(
        'Error message: Incompatible parameters passed. Pass either --flexui1.0 or --flexui2.0 to create a plugin compatible with the Flex UI version',
      );
    }

    // Make the flag readable to the parser
    if (argv.includes('--flexui2.0')) {
      argv.splice(argv.indexOf('--flexui2.0'), 1);
      argv.push('--flexui2', 'true');
    }

    // Remove this flag if passed since it represents the default functionality
    if (argv.includes('--flexui1.0')) {
      argv.splice(argv.indexOf('--flexui1.0'), 1);
    }

    return argv;
  }

  /**
   * Main script to run
   *
   * @returns {Promise<void>}
   */
  async run(): Promise<void> {
    // @ts-ignore
    const { flags: instanceFlags, args } = this.parse(FlexPluginsCreate);

    const createFlexPlugin = new CreateFlexPlugin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scriptArgs = FlexPluginsCreate.toArgv(instanceFlags as any);
    scriptArgs.unshift(args.name);

    await createFlexPlugin.parse(...FlexPluginsCreate.editArgv(scriptArgs));
  }

  async runCommand(): Promise<void> {
    return this.run();
  }
}
