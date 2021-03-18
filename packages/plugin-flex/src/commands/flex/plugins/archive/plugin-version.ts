import { PluginVersion } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';
import { archivePluginVersion as archivePluginVersionDocs } from '../../../../commandDocs.json';

export default class FlexPluginsArchivePluginVersion extends ArchiveResource<PluginVersion> {
  static description = createDescription(archivePluginVersionDocs.description, false);

  static flags = {
    ...ArchiveResource.flags,
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
    const { version, name } = this._flags;
    return `${name}@${version}`;
  }

  /**
   * @override
   */
  getResourceType(): string {
    return 'Flex Plugin Version';
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchivePluginVersion.flags> {
    return this.parse(FlexPluginsArchivePluginVersion).flags;
  }
}
