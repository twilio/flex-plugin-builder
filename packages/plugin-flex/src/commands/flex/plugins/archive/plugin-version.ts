import { PluginVersion } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';

export default class FlexPluginsArchivePluginVersion extends ArchiveResource<PluginVersion> {
  static topicName = 'flex:plugins:archive:plugin-version';

  static description = createDescription(FlexPluginsArchivePluginVersion.topic.description, false);

  static flags = {
    ...ArchiveResource.flags,
    name: flags.string({
      description: FlexPluginsArchivePluginVersion.topic.flags.name,
      required: true,
    }),
    version: flags.string({
      description: FlexPluginsArchivePluginVersion.topic.flags.version,
      required: true,
    }),
  };

  /**
   * @override
   */
  async doArchive(): Promise<PluginVersion> {
    return this.pluginsApiToolkit.archivePluginVersion({ name: this._flags.name, version: this._flags.version });
  }

  /**
   * @override
   */
  getName(): string {
    const { version, name } = this._flags;
    return `**${name}@${version}**`;
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchivePluginVersion.flags> {
    return this.parse(FlexPluginsArchivePluginVersion).flags;
  }
}
