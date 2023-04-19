import { ListReleases } from '@twilio/flex-plugins-api-client';

import { createDescription } from '../../../../utils/general';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';

/**
 * Lists the Flex Plugin Releases
 */
export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListReleases[]> {
  static topicName = 'flex:plugins:list:releases';

  static description = createDescription(FlexPluginsListPlugins.topic.description, false);

  static flags = {
    ...InformationFlexPlugin.flags,
  };

  /**
   * @override
   */
  async getResource(): Promise<ListReleases[]> {
    const result = await this.pluginsApiToolkit.listReleases({});

    return result.releases;
  }

  /**
   * @override
   */
  /* c8 ignore next */
  notFound(): void {
    this._logger.info(`!!No releases where not found.!!`);
  }

  /**
   * @override
   */
  /* c8 ignore next */
  print(releases: ListReleases[]): void {
    releases.forEach((release) => {
      this.printVersion(release.sid);
      this.printPretty(release);
      this._logger.newline();
    });
  }
}
