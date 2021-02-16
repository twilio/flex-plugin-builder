import { Configuration } from 'flex-plugins-api-toolkit';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';
import { archiveConfiguration as archiveConfigurationDocs } from '../../../../commandDocs.json';
import FlexPlugin from '../../../../sub-commands/flex-plugin';

export default class FlexPluginsArchiveConfiguration extends ArchiveResource<Configuration> {
  static description = createDescription(archiveConfigurationDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
    sid: flags.string({
      description: archiveConfigurationDocs.flags.sid,
      required: true,
    }),
  };

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
    return `Configuration ${this._flags.sid}`;
  }

  /**
   * @override
   */
  get _flags() {
    return this.parse(FlexPluginsArchiveConfiguration).flags;
  }
}
