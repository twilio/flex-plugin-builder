import { PluginVersion } from '@twilio/flex-plugins-api-client';
import { progress, TwilioApiError } from '@twilio/flex-dev-utils';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { BuildInstance, BuildListInstanceCreateOptions } from 'twilio/lib/rest/serverless/v1/service/build';

import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
import { createDescription, instanceOf } from '../../../../utils/general';

export default class FlexPluginsArchivePluginVersion extends ArchiveResource<PluginVersion> {
  static topicName = 'flex:plugins:archive:plugin-version';

  static description = createDescription(FlexPluginsArchivePluginVersion.topic.description, false);

  static flags = {
    ...ArchiveResource.flags,
    name: flags.string({
      description: FlexPluginsArchivePluginVersion.topic.flags.name,
      required: true,
    }),
    version: flags.string({
      description: FlexPluginsArchivePluginVersion.topic.flags.version,
      required: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsArchivePluginVersion.flags>;

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsArchivePluginVersion)).flags;
  }

  /**
   * @override
   */
  async doArchive(): Promise<PluginVersion> {
    const { pluginVersion } = await progress('Archiving Flex Plugin Version', async () => this.archiveOnPluginsAPI());
    if (pluginVersion.isArchived) {
      await progress('Cleaning up Twilio Assets', async () => {
        const build = await this.getBuildIfActive();
        if (!build) {
          throw new TwilioApiError(20400, 'Plugin version is already archived', 400);
        }
        await this.removeServerlessFiles(build);
      });
    }

    return pluginVersion;
  }

  /**
   * @override
   */
  getName(): string {
    const { version, name } = this._flags;
    return `${name}@${version}`;
  }

  /**
   * @override
   */
  getResourceType(): string {
    return 'Flex Plugin Version';
  }

  /**
   * Archives the resource on flex-plugins-api service
   * @private
   */
  private async archiveOnPluginsAPI() {
    try {
      const archivedPluginVersion = await this.pluginsApiToolkit.archivePluginVersion({
        name: this._flags.name,
        version: this._flags.version,
      });
      return { pluginVersion: archivedPluginVersion };
    } catch (e) {
      if (instanceOf(e, TwilioApiError) && e.status === 400) {
        const archivedPluginVersion = await this.pluginsApiToolkit.describePluginVersion({
          name: this._flags.name,
          version: this._flags.version,
        });
        return { pluginVersion: archivedPluginVersion };
      }

      throw e;
    }
  }

  /**
   * Removes the serverless files
   * @param build  the active {@link BuildInstance} to remove the files from
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public async removeServerlessFiles(build: BuildInstance) {
    const request: BuildListInstanceCreateOptions = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      functionVersions: build.functionVersions?.map((f) => (f as any).sid),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assetVersions: build.assetVersions?.filter((a) => !this.filterAssetExists(a)).map((a) => (a as any).sid),
      // @ts-ignore this is a type definition error in Twilio; dependencies should be object[] not a string
      dependencies: build.dependencies as string,
      runtime: 'node12',
    };

    if (request.assetVersions?.length === 0 && request.functionVersions?.length === 0) {
      const environment = await this.serverlessClient.getEnvironment(build.serviceSid, this._flags.name);
      if (environment) {
        await this.serverlessClient.deleteEnvironment(build.serviceSid, environment.sid);
      }

      return;
    }

    await this.serverlessClient.createBuildAndDeploy(build.serviceSid, this._flags.name, request);
  }

  /**
   * Filters the asset by path
   * @param asset the asset to filter
   * @private
   */
  //  The type definition for this from the twilio-node library is broken
  // eslint-disable-next-line @typescript-eslint/ban-types
  private filterAssetExists = (asset: object) => {
    const path = `/plugins/${this._flags.name}/${this._flags.version}/`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (asset as any).path.includes(path);
  };

  /**
   * Returns the {@link BuildInstance} if found. It will also return undefined if the pluginVersion is not part of this build
   * @private
   */

  private async getBuildIfActive(): Promise<BuildInstance | undefined> {
    const serviceSid = await this.flexConfigurationClient.getServerlessSid();
    if (!serviceSid) {
      return undefined;
    }

    const build = await this.serverlessClient.getBuild(serviceSid, this._flags.name);
    if (!build?.assetVersions.find(this.filterAssetExists)) {
      return undefined;
    }

    return build;
  }
}
