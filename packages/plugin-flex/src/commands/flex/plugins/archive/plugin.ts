import { Plugin } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';
import { archivePlugin as archivePluginDocs } from '../../../../commandDocs.json';

export default class FlexPluginsArchivePlugin extends ArchiveResource<Plugin> {
  static description = createDescription(archivePluginDocs.description, false);

  static flags = {
    ...ArchiveResource.flags,
    name: flags.string({
      description: archivePluginDocs.flags.name,
      required: true,
    }),
  };

  /**
   * @override
   */
  async doArchive(): Promise<Plugin> {
    return this.pluginsApiToolkit.archivePlugin({ name: this._flags.name });
  }

  /**
   * @override
   */
  getName(): string {
    return this._flags.name;
  }

  /**
   * @override
   */
  getResourceType(): string {
    return 'Flex Plugin';
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchivePlugin.flags> {
    return this.parse(FlexPluginsArchivePlugin).flags;
  }
}
