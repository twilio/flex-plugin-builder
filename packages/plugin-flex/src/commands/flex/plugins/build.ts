import { flags } from '@oclif/parser';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsBuild extends FlexPlugin {
  static topicName = 'flex:plugins:build';

  static description = createDescription(FlexPluginsBuild.topic.description, true);

  static flags = {
    ...baseFlags,
    wp5: flags.boolean({
      description: FlexPluginsBuild.topic.flags.wp5,
      default: false,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsBuild.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsBuild)).flags;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('pre-script-check');
    this.scriptArgs = this._flags.wp5 ? ['--wp5'] : [];
    await this.runScript('build');
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }

  /**
   * @override
   */
  getTopicName(): string {
    return FlexPluginsBuild.topicName;
  }
}
