import { Plugin } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { progress, TwilioApiError, TwilioCliError } from '@twilio/flex-dev-utils';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription, instanceOf } from '../../../../utils/general';

interface ArchivePluginResponse {
  alreadyArchived: boolean;
  plugin: Plugin;
}

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
    const response = await progress('Archiving Flex Plugin', async () => this.archiveOnPluginsAPI());
    await progress('Cleaning up Twilio Environment', async () =>
      this.removeServerlessEnvironment(response.alreadyArchived),
    );

    return response.plugin;
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
  private async archiveOnPluginsAPI(): Promise<ArchivePluginResponse> {
    try {
      const plugin = await this.pluginsApiToolkit.archivePlugin({ name: this._flags.name });
      return {
        plugin,
        alreadyArchived: false,
      };
    } catch (e) {
      if (instanceOf(e, TwilioApiError) && e.status === 400) {
        const plugin = await this.pluginsApiToolkit.describePlugin({
          name: this._flags.name,
        });
        return {
          plugin,
          alreadyArchived: true,
        };
      }

      throw e;
    }
  }

  /**
   * Removes the {@link EnvironmentInstance}
   * @param alreadyArchived whether the resource on plugins-api is already archived or not
   * @private
   */
  private async removeServerlessEnvironment(alreadyArchived: boolean): Promise<void> {
    const serviceSid = await this.flexConfigurationClient.getServerlessSid();
    if (!serviceSid) {
      if (alreadyArchived) {
        throw new TwilioApiError(20400, 'Plugin is already archived', 400);
      }
      return;
    }

    const environment = await this.serverlessClient.getEnvironment(serviceSid, this._flags.name);
    if (!environment) {
      if (alreadyArchived) {
        throw new TwilioApiError(20400, 'Plugin is already archived', 400);
      }
      return;
    }

    const isSuccessful = await this.serverlessClient.deleteEnvironment(serviceSid, environment.sid);
    if (!isSuccessful) {
      throw new TwilioCliError(
        'Could not archive your plugin due to failure in deleting the environment hosting your plugin. Please retry by running the archive command.',
      );
    }
  }

  /**
   * @override
   */
  /* istanbul ignore next */
  get _flags(): OutputFlags<typeof FlexPluginsArchivePlugin.flags> {
    return this.parse(FlexPluginsArchivePlugin).flags;
  }
}
