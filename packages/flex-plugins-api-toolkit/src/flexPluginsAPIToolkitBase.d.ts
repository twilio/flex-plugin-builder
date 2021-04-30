import { ServiceHttpClient } from 'flex-plugins-api-client';
import { CreateConfigurationScript, DeployScript, DescribeConfigurationScript, ArchiveConfigurationScript, DescribePluginScript, ArchivePluginScript, DescribePluginVersionScript, ArchivePluginVersionScript, DescribeReleaseScript, DiffScript, ListConfigurationsScript, ListPluginsScripts, ListPluginVersionsScripts, ListReleasesScript, ReleaseScript } from './scripts';
export default class FlexPluginsAPIToolkitBase {
    readonly deploy: DeployScript;
    readonly createConfiguration: CreateConfigurationScript;
    readonly release: ReleaseScript;
    readonly listPlugins: ListPluginsScripts;
    readonly describePlugin: DescribePluginScript;
    readonly archivePlugin: ArchivePluginScript;
    readonly listPluginVersions: ListPluginVersionsScripts;
    readonly describePluginVersion: DescribePluginVersionScript;
    readonly archivePluginVersion: ArchivePluginVersionScript;
    readonly listConfigurations: ListConfigurationsScript;
    readonly describeConfiguration: DescribeConfigurationScript;
    readonly archiveConfiguration: ArchiveConfigurationScript;
    readonly listReleases: ListReleasesScript;
    readonly describeRelease: DescribeReleaseScript;
    readonly diff: DiffScript;
    constructor(httpClient: ServiceHttpClient);
    private cloneArgs;
}
