import { Configuration } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription } from '../../../../utils/general';
import { archiveConfiguration as archiveConfigurationDocs } from '../../../../commandDocs.json';

export default class FlexPluginsArchiveConfiguration extends ArchiveResource<Configuration> {
  static description = createDescription(archiveConfigurationDocs.description, false);

  static flags = {
    ...ArchiveResource.flags,
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
    return this.parse(FlexPluginsArchiveConfiguration).flags;
  }
}
