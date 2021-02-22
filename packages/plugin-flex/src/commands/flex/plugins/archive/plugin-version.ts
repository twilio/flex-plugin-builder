import { PluginVersion } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';
import { archivePluginVersion as archivePluginVersionDocs } from '../../../../commandDocs.json';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

export default class FlexPluginsArchivePluginVersion extends ArchiveResource<PluginVersion> {
  static description = createDescription(archivePluginVersionDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      description: archivePluginVersionDocs.flags.name,
      required: true,
    }),
    version: flags.string({
      description: archivePluginVersionDocs.flags.version,
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
    return `Plugin Version ${this._flags.version}`;
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchivePluginVersion.flags> {
    return this.parse(FlexPluginsArchivePluginVersion).flags;
  }
}
