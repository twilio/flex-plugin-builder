import { Plugin } from 'flex-plugins-api-toolkit';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';
import { archivePlugin as archivePluginDocs } from '../../../../commandDocs.json';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

export default class FlexPluginsArchivePlugin extends ArchiveResource<Plugin> {
  static description = createDescription(archivePluginDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
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
    return `Plugin ${this._flags.name}`;
  }

  /**
   * @override
   */
  get _flags() {
    return this.parse(FlexPluginsArchivePlugin).flags;
  }
}
