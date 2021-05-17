[![Version](https://img.shields.io/npm/v/flex-plugins-api-toolkit.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-toolkit)
[![Download](https://img.shields.io/npm/dt/flex-plugins-api-toolkit.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-toolkit)
[![License](https://img.shields.io/npm/l/flex-plugins-api-toolkit.svg?style=square)](../../LICENSE)

# Flex Plugins API Toolkit

A wrapper for performing the most common use cases of the Flex Plugins API.

## Installation

Install this package using:

```bash
# Using npm
npm i -S flex-plugins-api-toolkit

# Using yarn
yarn add flex-plugins-api-toolkit
``` 

## Usage

Instantiate a `FlexPluginsAPIToolkit` client by providing username/password (AccountSid/AuthToken, API Key/Secret, or JWE token).

```js
import FlexPluginsAPIToolkit from 'flex-plugins-api-toolkit';

// Instantiate the HTTP client
const toolkit = new FlexPluginsAPIToolkit(process.env.USERNAME, process.env.PASSWORD);

// In case of a JWE token, the username is "token" and the password is your JWE token.
```

## Methods

The toolkit provides the following commands. 

**Note**: If you are using the JWE token for authentication, then _all_ identifiers (such as `name`, `version`, etc) _must_ be the sid of the resource only.

### .deploy(option: DeployOption): Promise\<DeployPlugin>

This command deploys a new plugin version to Plugins API. This wrapper upserts a plugin (i.e., updates the plugin if it exists, otherwise creates a new plugin) and then creates a new version. 

The command takes an argument object of the format:

```ts
interface DeployOption {
  name: string;
  url: string;
  version: string;
  friendlyName?: string;
  description?: string;
  changelog?: string;
  isPrivate?: boolean;
}
```

The command returns a promise of type:

```ts
interface DeployPlugin {
  pluginSid: string;
  pluginVersionSid: string;
  name: string;
  version: string;
  url: string;
  friendlyName: string;
  description: string;
  changelog: string;
  isPrivate: boolean;
}
```

### .createConfiguration(option: CreateConfigurationOption): Promise\<CreateConfiguration>

This command creates a new configuration and installs a list of provided plugins. 

The command takes an argument object of the format:

```ts
interface CreateConfigurationOption {
  addPlugins: string[];
  removePlugins?: string[];
  description?: string;
  fromConfiguration?: 'active' | string;
}
```

where the `addPlugins` field is an array of plugins formatted as `pluginName@version`. It is the list of plugins, and their corresponding versions that you want to include in this plugin (you can use Sids or unique name/version):

```ts
const option = {
  addPlugins: [
    'plugin-sample@1.0.0',
    'FPxxx@1.0.0',
    'another-plugin@FVxxx',
    'FPxxy@FVxxy'
  ],
  ...
}
```

The option `removePlugins` is useful when you want to create a new configuration from an existing configuration but then remove some plugins. This parameter is an array of plugin names only:

```ts
const option = {
  addPlugins: [
    'plugin-sample@1.0.0',
    'FPxxx@1.0.0',
    'another-plugin@FVxxx',
    'FPxxy@FVxxy'
  ],
  removePlugins: ['pluginName'],
  ...
}
```

The command returns a promise of type:

```ts
export interface CreateConfiguration {
  configurationSid: string;
  name: string;
  description: string;
  dateCreated: string;
  plugins: Array<{
    pluginSid: string;
    pluginVersionSid: string;
    name: string;
    version: string;
    url: string;
    friendlyName: string;
    description: string;
    changelog: string;
    isPrivate: boolean;
    phase: number;
  }>;
}
```

### .release(option: ReleaseOption): Promise\<Release>

This command creates a new release and activates the given configuration. 

The command takes an argument object of the format:

```ts
interface ReleaseOption {
  configurationSid: string;
}
```

The command returns a promise of type:

```ts
interface Release {
  releaseSid: string;
  configurationSid: string;
  dateCreated: string;
}
```

### .describePlugin(option: DescribePluginOption): Promise\<DescribePlugin>

This command returns information about a plugin and its versions. 

The command takes an argument object of the format:

```ts
interface DescribePluginOption {
  name: string;
}
```

where the  `name` is either the plugin's unique name or its sid.

The command returns a promise of type:

```ts
interface DescribePlugin {
  sid: string;
  name: string;
  friendlyName: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
  dateUpdated: string;
  versions: Array<{
    sid: string;
    version: string;
    url: string;
    changelog: string;
    isPrivate: boolean;
    isActive: boolean;
    dateCreated: string;
  }>;
}
```

The field `isActive` is set to true if this plugin is part of an active release. The associated version that is part of the active release also has `isActive` set to true.

### .describePluginVersion(option: DescribePluginVersionOption): Promise\<DescribePluginVersion>

This command returns information about a plugin version.

The command takes an argument object of the format:

```ts
interface DescribePluginVersionOption {
  name: string;
  version: string;
}
```

where the `name` is either the plugin's unique name or its sid; the version is either the plugin version's version or its sid.

The command returns a promise of type:

```ts
interface DescribePluginVersion {
  sid: string;
  version: string;
  url: string;
  changelog: string;
  isPrivate: boolean;
  isActive: boolean;
  plugin: {
    sid: string;
    name: string;
    friendlyName: string;
    description: string;
    dateCreated: string;
    dateUpdated: string;
  };
  dateCreated: string;
}
```

The field `isActive` is set to true if this plugin version is part of an active release. 

### .describeConfiguration(option: DescribeConfigurationOption): Promise\<DescribeConfiguration>

This command returns information about a configuration, including a list of plugins included in it.

The command takes an argument object of the format:

```ts
interface DescribeConfigurationOption {
  sid: string;
}
```

The command returns a promise of type:

```ts
interface DescribeConfiguration {
  sid: string;
  name: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
  plugins: Array<{
    pluginSid: string;
    pluginVersionSid: string;
    name: string;
    version: string;
    url: string;
    friendlyName: string;
    description: string;
    changelog: string;
    isPrivate: boolean;
    phase: number;
  }>;
}
```

The field `isActive` is set to true if this configuration is part of an active release.

### .describeRelease(option: DescribeReleaseOption): Promise\<Release>

This command returns information about a release.

The command takes an argument object of the format:

```ts
interface DescribeReleaseOption {
  sid: string;
}
```

The command returns a promise of type:

```ts
interface Release {
  sid: string;
  configurationSid: string;
  isActive: boolean;
  dateCreated: string;
  configuration: {
    sid: string;
    name: string;
    description: string;
    isActive: boolean;
    dateCreated: string;
    plugins: Array<{
      pluginSid: string;
      pluginVersionSid: string;
      name: string;
      version: string;
      url: string;
      friendlyName: string;
      description: string;
      changelog: string;
      isPrivate: boolean;
      phase: number;
   }>;
  }
}
```

The field `isActive` is set to true if this release is the active release.

### .listPlugins(option: ListPluginsOption): Promise\<ListPluginsResource>

This command returns a list of plugins. 

The command takes an argument object of the format:

```ts
interface ListPluginsOption {
  page?: Pagination;
}
```

The command returns a promise of type:

```ts
interface ListPluginsResource {
  plugins: Array<{
    sid: string;
    name: string;
    friendlyName: string;
    description: string;
    isActive: boolean;
    dateCreated: string;
    dateUpdated: string;
  }>;
  meta: PaginationMeta;
}
```

The field `isActive` is set to true if this plugin is part of an active release.

### .listPluginVersions(option: ListPluginVersionsOption): Promise\<ListPluginVersionsResource>

This command returns a list of plugins. 

The command takes an argument object of the format:

```ts
interface ListPluginVersionsOption {
  name: string;
  page?: Pagination;
}
```

The command returns a promise of type:

```ts
interface ListPluginVersionsResource {
  plugin_versions: Array<{
    sid: string;
    pluginSid: string;
    version: string;
    url: string;
    changelog: string;
    isPrivate: boolean;
    isActive: boolean;
    dateCreated: string;  
  }>;
  meta: PaginationMeta;
}
```

The field `isActive` is set to true if this plugin version is part of an active release.

### .listConfigurations(option: ListConfigurationsOption): Promise\<ListConfigurationsResource>

This command returns a list of plugins. 

The command takes an argument object of the format:

```ts
interface ListConfigurationsOption {
  page?: Pagination;
}
```

The command returns a promise of type:

```ts
interface ListConfigurationsResource {
  plugins: Array<{
    sid: string;
    name: string;
    description: string;
    isActive: boolean;
    dateCreated: string;
  }>;
  meta: PaginationMeta;
}
```

The field `isActive` is set to true if this configuration is part of an active release.

### .listReleases(option: ListReleasesOption): Promise\<ListReleasesResource>

This command returns a list of plugins. 

The command takes an argument object of the format:

```ts
interface ListReleasesOption {
  page?: Pagination;
}
```

The command returns a promise of type:

```ts
interface ListReleasesResource {
  plugins: Array<{
    sid: string;
    configurationSid: string;
    dateCreated: string;
  }>;
  meta: PaginationMeta;
}
```

### .diff(option: DiffOption): Promise\<Diff>

This commands returns a diff of two configurations.

The command takes an argument object of the format:

```ts
export interface DiffOption {
  resource: 'configuration';
  oldIdentifier: string;
  newIdentifier: string;
}
```

where `oldIdentifier/newIdentifier` can either be a ConfigurationSid or the string `active`. If `active` is returned, the script finds the ConfigurationSid corresponding to the active Configuration.

The command returns a promise of type:

```ts
interface Difference<T> {
  path: keyof T;
  hasDiff: boolean;
  before: unknown;
  after: unknown;
}

interface ConfigurationsDiff {
  configuration: Difference<Omit<DescribeConfiguration, 'plugins'>>[];
  plugins: {
    [key: string]: Difference<ConfiguredPlugins>[];
  };
}
type Diff = ConfigurationsDiff;
```

## Shared Types

The `Pagination` interface is:

```ts
interface Pagination {
  pageSize?: number;
  page?: number;
  pageToken?: string;
}
```

The `PaginationMeta` interface is:

```ts
interface PaginationMeta {
  meta: {
    page: number;
    page_size: number;
    first_page_url: string;
    previous_page_url: string;
    url: string;
    next_page_url?: string;
    key: string;
    next_token?: string;
    previous_token?: string;
  };
}
```

where `next_token` and `previous_token` are extracted `PageToken` query parameter from the `next_page_url` and `previous_page_url` parameter respectively.

## Tools

This package also exposes the following tools:

### findConfigurationsDiff(oldConfiguration: DescribeConfiguration, newConfiguration: DescribeConfiguration): ConfigurationsDiff

This tool compares two `DescribeConfiguration` and returns the diff between the two. 
