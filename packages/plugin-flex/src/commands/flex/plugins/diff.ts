import { Difference, Diff } from '@twilio/flex-plugins-api-client';
import { TwilioCliError } from '@twilio/flex-dev-utils';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { isNullOrUndefined } from '../../../utils/strings';

type Args = {
  [name: string]: any;
};

/**
 * Configuration sid parser
 * @param input the input from the CLI
 */
const parser = (input: string): string => {
  if (input === 'active') {
    return input;
  }

  if (!input || !input.startsWith('FJ')) {
    throw new TwilioCliError(`Identifier must of a ConfigurationSid or 'active'; instead got ${input}`);
  }

  return input;
};

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Finds the difference between two Flex Plugin Configuration
 */
export default class FlexPluginsDiff extends FlexPlugin {
  static topicName = 'flex:plugins:diff';

  static pluginDiffPrefix = '..│.. ';

  static description = createDescription(FlexPluginsDiff.topic.description, false);

  static args = [
    {
      description: FlexPluginsDiff.topic.args.id1,
      name: 'id1',
      required: true,
      parse: parser,
    },
    {
      description: FlexPluginsDiff.topic.args.id2,
      name: 'id2',
      arse: parser,
    },
  ];

  static flags = {
    ...baseFlags,
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsDiff.flags>;

  // @ts-ignore
  public _args: Args;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });
  }

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsDiff)).flags;
    this._args = (await this.parseCommand(FlexPluginsDiff)).args;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    const diffs = await this.getDiffs();

    const oldSidText = diffs.activeSid === diffs.oldSid ? `${diffs.oldSid} (active)` : diffs.oldSid;
    const newSidText = diffs.activeSid === diffs.newSid ? `${diffs.newSid} (active)` : diffs.newSid;
    this._logger.info(`Showing the changes from releasing **${oldSidText}** to **${newSidText}**`);
    this._logger.newline();

    diffs.configuration.forEach((diff) => this.printDiff(diff));
    this._logger.newline();

    this.printHeader('Plugins');
    Object.keys(diffs.plugins).forEach((key) => {
      const isDeleted = diffs.plugins[key].every(
        (diff) => isNullOrUndefined(diff.after) && !isNullOrUndefined(diff.before),
      );
      const isAdded = diffs.plugins[key].every(
        (diff) => isNullOrUndefined(diff.before) && !isNullOrUndefined(diff.after),
      );
      if (isDeleted) {
        this._logger.info(`**--- ${key}--**`);
      } else if (isAdded) {
        this._logger.info(`**+++ ${key}++**`);
      } else {
        this._logger.info(`**${key}**`);
      }

      diffs.plugins[key].forEach((diff) => this.printDiff(diff, FlexPluginsDiff.pluginDiffPrefix));
      this._logger.newline();
    });
  }

  /**
   * Finds the diff
   */
  async getDiffs(): Promise<Diff> {
    // if only one argument is provided, it's because you are comparing "active to configId"
    const { id1, id2 } = this._args;
    return this.pluginsApiToolkit.diff({
      resource: 'configuration',
      oldIdentifier: id2 ? id1 : 'active',
      newIdentifier: id2 ? id2 : id1,
    });
  }

  /**
   * Prints the diff
   * @param diff    the diff to print
   * @param prefix  the prefix to add to each entry
   */
  printDiff<T>(diff: Difference<T>, prefix: string = ''): void {
    const path = diff.path as string;
    const before = diff.before as string;
    const after = diff.after as string;

    const header = FlexPlugin.getHeader(path);
    if (diff.hasDiff) {
      if (!isNullOrUndefined(before)) {
        this._logger.info(`${prefix}--- ${header}: ${FlexPlugin.getValue(path, before)}--`);
      }
      if (!isNullOrUndefined(after)) {
        this._logger.info(`${prefix}+++ ${header}: ${FlexPlugin.getValue(path, after)}++`);
      }
    } else {
      this._logger.info(`${prefix}${header}: ${FlexPlugin.getValue(path, before)}`);
    }
  }
}
