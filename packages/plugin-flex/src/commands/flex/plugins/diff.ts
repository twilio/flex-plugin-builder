import { Difference } from 'flex-plugins-api-toolkit/dist/tools/diff';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { TwilioCliError } from '../../../exceptions';
import { isNullOrUndefined } from '../../../utils/strings';
import { diff as diffDocs } from '../../../commandDocs.json';

/**
 * Configuration sid parser
 * @param input the input from the CLI
 */
export const parser = (input: string) => {
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
  static pluginDiffPrefix = '..│.. ';

  static description = createDescription(diffDocs.description, false);

  static args = [
    {
      description: diffDocs.args.id1,
      name: 'id1',
      required: true,
      parse: parser,
    },
    {
      description: diffDocs.args.id2,
      name: 'id2',
      arse: parser,
    },
  ];

  static flags = {
    ...baseFlags,
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });
  }

  /**
   * @override
   */
  async doRun() {
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
  async getDiffs() {
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
  printDiff<T>(diff: Difference<T>, prefix: string = '') {
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

  /* istanbul ignore next */
  get _flags() {
    return this.parse(FlexPluginsDiff).flags;
  }

  /* istanbul ignore next */
  get _args() {
    return this.parse(FlexPluginsDiff).args;
  }
}
