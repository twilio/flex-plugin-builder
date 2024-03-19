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
  };

  /**
   * @override
   */
  async doRun(): Promise<void> {
    process.env.PERSIST_TERMINAL = 'true';
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
