import { flags } from '@oclif/command';
import { TwilioApiError } from 'flex-plugins-utils-exception';
import { DescribeRelease } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsDescribeRelease extends InformationFlexPlugin<DescribeRelease> {
  static description = createDescription('Describes a release', false);

  static flags = {
    ...FlexPlugin.flags,
    sid: flags.string({
      description: 'The release sid to describe',
      exclusive: ['active'],
    }),
    active: flags.boolean({
      exclusive: ['sid'],
    }),
  };

  async getResource() {
    if (this._flags.active) {
      const release = await this.releasesClient.active();
      if (!release) {
        throw new TwilioApiError(20404, 'No active release was found', 404);
      }

      return this.pluginsApiToolkit.describeRelease({ sid: release?.sid });
    }

    return this.pluginsApiToolkit.describeRelease({ sid: this._flags.sid as string });
  }

  notFound(): void {
    this._logger.info(`!!Release **${this.releaseId}** was not found.!!`);
  }

  get releaseId() {
    const { sid } = this._flags;
    return sid ? sid : 'active';
  }

  get _flags() {
    return this.parse(FlexPluginsDescribeRelease).flags;
  }

  print(release: DescribeRelease) {
    this.printHeader('Sid', release.sid);
    this.printHeader('Status', release.isActive);
    this.printHeader('Created', release.dateCreated);
    this._logger.newline();

    this.printHeader('Configuration');
    this.printPretty(release.configuration, 'isActive', 'plugins');
    this._logger.newline();

    this.printHeader('Plugins');
    release.configuration.plugins.forEach((plugin) => {
      this.printVersion(plugin.name);
      this.printPretty(plugin);
      this._logger.newline();
    });
  }
}
