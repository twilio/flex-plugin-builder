import { Plugin } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { progress, TwilioApiError } from 'flex-dev-utils';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription, instanceOf } from '../../../../utils/general';

export default class FlexPluginsArchivePlugin extends ArchiveResource<Plugin> {
  static topicName = 'flex:plugins:archive:plugin';

  static description = createDescription(FlexPluginsArchivePlugin.topic.description, false);

  static flags = {
    ...ArchiveResource.flags,
    name: flags.string({
      description: FlexPluginsArchivePlugin.topic.flags.name,
      required: true,
    }),
  };

  /**
   * @override
   */
  async doArchive(): Promise<Plugin> {
    const plugin = await progress('Archiving Flex Plugin', async () => this.archiveOnPluginsAPI());
    await progress('Cleaning up Twilio Environment', async () => {
      const isDeleteSuccessful = await this.removeServerlessFiles();
      if (!isDeleteSuccessful) {
        // TODO: let user know the cleanup was unsuccessful and to try again
      }
    });

    return plugin;
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
   * Archives the resource on flex-plugins-api service
   * @private
   */
  private async archiveOnPluginsAPI() {
    try {
      return await this.pluginsApiToolkit.archivePlugin({ name: this._flags.name });
    } catch (e) {
      if (instanceOf(e, TwilioApiError) && e.status === 400) {
        return this.pluginsApiToolkit.describePlugin({
          name: this._flags.name,
        });
      }

      throw e;
    }
  }

  /**
   * Removes the serverless files
   * @param build  the active {@link BuildInstance} to remove the files from
   * @private
   */
  private async removeServerlessFiles() {
    const serviceSid = await this.flexConfigurationClient.getServerlessSid();
    if (!serviceSid) {
      throw new TwilioApiError(20400, 'Plugin is already archived', 400);
    }

    const environment = await this.serverlessClient.getEnvironment(serviceSid, this._flags.name);
    if (!environment) {
      throw new TwilioApiError(20400, 'Plugin is already archived', 400);
    }

    return this.serverlessClient.deleteEnvironment(serviceSid, environment.sid);
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchivePlugin.flags> {
    return this.parse(FlexPluginsArchivePlugin).flags;
  }
}
