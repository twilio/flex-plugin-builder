const { flags } = require('@oclif/command');
const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const CreateFlexPlugin = require('create-flex-plugin').default;

const { createDescription } = require('../../../utils/general');

/**
 * Creates a new Flex plugin
 */
class FlexPluginsCreate extends TwilioClientCommand {
  /**
   * Converts yArgs to OClif flags
   *
   * @param yargs   the yargs flags
   * @returns the OClif args
   */
  static parseYargs(yargs) {
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
  static toArgv(args) {
    return Object.keys(args).reduce((result, key) => {
      result.push(`--${key}`, args[key]);

      return result;
    }, []);
  }

  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage);

    this.showHeaders = true;
  }

  /**
   * Main script to run
   *
   * @returns {Promise<void>}
   */
  async doRun() {
    const { flags: instanceFlags, args } = this.parse(FlexPluginsCreate);
    const createFlexPlugin = new CreateFlexPlugin();
    const scriptArgs = FlexPluginsCreate.toArgv(instanceFlags);
    scriptArgs.unshift(args.name);

    await createFlexPlugin.parse(...scriptArgs);
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsCreate.description = createDescription(CreateFlexPlugin.description);
FlexPluginsCreate.flags = Object.assign(
  FlexPluginsCreate.parseYargs(CreateFlexPlugin.flags),
  TwilioClientCommand.flags,
);
FlexPluginsCreate.args = [
  {
    name: 'name',
    required: true,
    description: CreateFlexPlugin.description,
  },
];

module.exports = FlexPluginsCreate;
