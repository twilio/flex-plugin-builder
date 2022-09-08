import { Configuration } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { TwilioCliError } from '@twilio/flex-dev-utils';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';

export default class FlexPluginsArchiveConfiguration extends ArchiveResource<Configuration> {
  static topicName = 'flex:plugins:archive:configuration';

  static description = createDescription(FlexPluginsArchiveConfiguration.topic.description, false);

  static flags = {
    ...ArchiveResource.flags,
    sid: flags.string({
      description: FlexPluginsArchiveConfiguration.topic.flags.sid,
      required: true,
    }),
  };

  protected _parsedFlags?: OutputFlags<typeof FlexPluginsArchiveConfiguration.flags>;

  async init(): Promise<void> {
    this._parsedFlags = (await this.parseCommand(FlexPluginsArchiveConfiguration)).flags;
  }

  /**
   * @override
   */
  async doArchive(): Promise<Configuration> {
    return this.pluginsApiToolkit.archiveConfiguration({ sid: this._flags.sid });
  }

  /**
   * @override
   */
  getName(): string {
    return this._flags.sid;
  }

  /**
   * @override
   */
  getResourceType(): string {
    return 'Flex Configuration';
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchiveConfiguration.flags> {
    if (!this._parsedFlags) {
      throw new TwilioCliError('Flags are not parsed yet');
    }
    return this._parsedFlags;
  }
}
