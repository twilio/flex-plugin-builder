import { flags } from '@oclif/parser';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

export type ValidateResult = {
  violations: string[];
  vtime: number;
  error?: {
    message: string;
    timedOut: boolean;
  };
};

/**
 * Validates the plugin
 */
// eslint-disable-next-line import/no-unused-modules
export default class FlexPluginValidate extends FlexPlugin {
  static topicName = 'flex:plugins:validate';

  static description = createDescription(FlexPluginValidate.topic.description, false);

  static flags = {
    ...baseFlags,
    'flex-ui-2.0': flags.boolean({
      description: FlexPluginValidate.topic.flags.flexui2,
      default: false,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginValidate.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginValidate)).flags;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    process.env.PERSIST_TERMINAL = 'true';
    this.scriptArgs = this._flags['flex-ui-2.0'] ? ['--flex-ui-2.0'] : [];
    const { violations, vtime, error }: ValidateResult = (await this.runScript('validate')) as ValidateResult;
    this.telemetryProperties = { violations, vtime: Math.round(vtime), error, deployed: 0 };
  }

  /**
   * @override
   */
  getTopicName(): string {
    return FlexPluginValidate.topicName;
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }
}
