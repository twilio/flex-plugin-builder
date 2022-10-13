import { Configuration } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';

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

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsArchiveConfiguration.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsArchiveConfiguration)).flags;
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
}
