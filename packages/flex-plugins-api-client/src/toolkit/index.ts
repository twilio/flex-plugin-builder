import { Region } from '@twilio/flex-dev-utils/dist/env';
import { OptionalHttpClientConfig } from '@twilio/flex-dev-utils/dist/http';

import { PluginServiceHTTPClient } from '../clients';
import FlexPluginsAPIToolkitBase from './flexPluginsAPIToolkitBase';

export {
  DeployOption,
  DeployPlugin,
  CreateConfigurationOption,
  CreateConfiguration,
  ReleaseOption,
  Release,
  DescribePluginOption,
  DescribePlugin,
  Plugin,
  DescribePluginVersionOption,
  DescribePluginVersion,
  PluginVersion,
  DescribeConfigurationOption,
  DescribeConfiguration,
  DescribeReleaseOption,
  DescribeRelease,
  Configuration,
  InstalledPlugin,
  ListPluginsOption,
  ListPluginsResource,
  ListPlugins,
  ListPluginVersionsOption,
  ListPluginVersionsResource,
  ListPluginVersions,
  ListConfigurationsOption,
  ListConfigurationsResource,
  ListConfigurations,
  ListReleasesOption,
  ListReleasesResource,
  ListReleases,
  ArchivePluginOption,
  ArchivePluginVersionOption,
  ArchiveConfigurationOption,
  DiffOption,
  Diff,
} from './scripts';

interface FlexPluginsAPIToolkitOptions extends OptionalHttpClientConfig {
  region?: Region;
}

export { default as FlexPluginsAPIToolkitBase } from './flexPluginsAPIToolkitBase';

export { Difference, ConfigurationsDiff, findConfigurationsDiff, buildDiff } from './tools';

export default class FlexPluginsAPIToolkit extends FlexPluginsAPIToolkitBase {
  constructor(username: string, password: string, options?: FlexPluginsAPIToolkitOptions) {
    const httpClient = new PluginServiceHTTPClient(username, password, options);

    super(httpClient);
  }
}
