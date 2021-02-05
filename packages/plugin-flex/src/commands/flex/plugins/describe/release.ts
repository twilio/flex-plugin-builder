import { flags } from '@oclif/command';
import { TwilioApiError } from 'flex-dev-utils';
import { DescribeRelease } from 'flex-plugins-api-toolkit';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
import { describeRelease as describeReleaseDocs } from '../../../../commandDocs.json';

/**
 * Describes the Flex Plugin Release
 */
export default class FlexPluginsDescribeRelease extends InformationFlexPlugin<DescribeRelease> {
  static description = createDescription(describeReleaseDocs.description, false);

  static flags = {
    ...FlexPlugin.flags,
    sid: flags.string({
      description: describeReleaseDocs.flags.sid,
      exclusive: ['active'],
    }),
    active: flags.boolean({
      description: describeReleaseDocs.flags.active,
      exclusive: ['sid'],
    }),
  };

  /**
   * @override
   */
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

  /**
   * @override
   */
  /* istanbul ignore next */
  notFound() {
    this._logger.info(`!!Release **${this._flags.sid || 'active'}** was not found.!!`);
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  print(release: DescribeRelease) {
    this.printHeader('Sid', release.sid);
    this.printHeader('Status', release.isActive);
    this.printHeader('Created', release.dateCreated);
    this._logger.newline();

    this.printHeader('Configuration');
    this.printPretty(release.configuration, 'isActive', 'plugins');
    this._logger.newline();

    this.printHeader('Plugins');
    if (release.configuration.plugins.length === 0) {
      this._logger.info('There are no active plugins');
    }

    release.configuration.plugins.forEach((plugin) => {
      this.printVersion(plugin.name);
      this.printPretty(plugin);
      this._logger.newline();
    });
  }

  /**
   * Parses the flags passed to this command
   */
  /* istanbul ignore next */
  get _flags() {
    return this.parse(FlexPluginsDescribeRelease).flags;
  }
}
