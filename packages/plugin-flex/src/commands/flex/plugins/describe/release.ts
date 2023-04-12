import { flags } from '@oclif/command';
import { TwilioApiError } from '@twilio/flex-dev-utils';
import { DescribeRelease } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../../utils/general';
import FlexPlugin from '../../../../sub-commands/flex-plugin';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Describes the Flex Plugin Release
 */
export default class FlexPluginsDescribeRelease extends InformationFlexPlugin<DescribeRelease> {
  static topicName = 'flex:plugins:describe:release';

  static description = createDescription(FlexPluginsDescribeRelease.topic.description, false);

  static flags = {
    ...FlexPlugin.flags,
    sid: flags.string({
      description: FlexPluginsDescribeRelease.topic.flags.sid,
      exclusive: ['active'],
    }),
    active: flags.boolean({
      description: FlexPluginsDescribeRelease.topic.flags.active,
      exclusive: ['sid'],
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsDescribeRelease.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsDescribeRelease)).flags;
  }

  /**
   * @override
   */
  async getResource(): Promise<DescribeRelease> {
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
  /* c8 ignore next */
  notFound(): void {
    this._logger.info(`!!Release **${this._flags.sid || 'active'}** was not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(release: DescribeRelease): void {
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
}
