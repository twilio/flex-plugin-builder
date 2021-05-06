[![Version](https://img.shields.io/npm/v/flex-plugins-api-client.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-client)
[![Download](https://img.shields.io/npm/dt/flex-plugins-api-client.svg?style=square)](https://www.npmjs.com/package/flex-plugins-api-client)
[![License](https://img.shields.io/npm/l/flex-plugins-api-client.svg?style=square)](../../LICENSE)

# Flex Plugins API Client

This package provides a NodeJS HTTP client for using the [Public API endpoints](https://www.twilio.com/docs/flex/plugins/api).

## Installation

Install this package using:

```bash
# Using npm
npm i -S flex-plugins-api-client

# Using yarn
yarn add flex-plugins-api-client
``` 

## Usage

Instantiate a `PluginServiceHttpClient` client by providing username/password (AccountSid/AuthToken, API Key/Secret, or JWE token). Then instantiate each client (corresponding to different resources) by passing this HTTP client to it:

```js
import {
    PluginServiceHttpClient,
    PluginsClient,
    PluginVersionsClient
} from 'flex-plugins-api-client';

// Instantiate the HTTP client
const httpClient = new PluginServiceHttpClient(process.env.USERNAME, process.env.PASSWORD);

// Now instantiate each endpoint client you want to use
const pluginsClient = new PluginsClient(httpClient);
const pluginsVersionClient = new PluginVersionsClient(httpClient);
```
## Clients

The available clients are listed below. All endpoints return a promise. 

**Note**: If you are using the JWE token for authentication, then _all_ identifiers (such as `pluginId`, `versionId`, etc) _must_ be the sid of the resource only.

### PluginsClient

This is the HTTP client for [plugins](https://www.twilio.com/docs/flex/plugins/api/plugin) endpoints. Available endpoints are:

#### list(pagination?: Pagination)

This endpoint lists all plugins. 

#### get(pluginId)

This endpoint fetches the provided plugin. The `pluginId` can either be the unique name or the plugin sid.

#### create(requestObject)

This endpoint creates a new plugin.

#### update(pluginId, updateObject)

This endpoint updates a plugin. The `pluginId` can either be the unique name or the plugin sid.

#### upsert(upsertObject)

This endpoint tries to find the plugin by uniqueName. If it is found, then it updates the plugin; otherwise, it creates a new plugin.

### PluginVersionsClient

This is the HTTP client for [plugin versions](https://www.twilio.com/docs/flex/plugins/api/plugin-version) endpoints. Available endpoints are:

#### list(pluginId, pagination?: Pagination)

This endpoint lists all plugin versions of the given plugin. The `pluginId` can either be the unique name or the plugin sid.

#### latest(pluginId)

This endpoint returns the latest plugin version (by the date created) of the given plugin. The `pluginId` can either be the unique name or the plugin sid.

#### get(pluginId, versionId)

This endpoint fetches the provided plugin version. The `pluginId` can either be the unique name or the plugin sid and the `versionId` can either be the version or the plugin version sid.

#### create(pluginId, requestObject)

This endpoint creates a new plugin version. The `pluginId` can either be the unique name or the plugin sid.

### ConfigurationsClient

This is the HTTP client for [configurations](https://www.twilio.com/docs/flex/plugins/api/plugin-configuration) endpoints. Available endpoints are:

#### list(pagination?: Pagination)

This endpoint lists all configurations.

#### get(configId)

This endpoint fetches the provided configuration. The `configId` can either be version of the configuration sid.

#### create(requestObject)

This endpoint creates a new configuration.

### ConfiguredPluginsClient

This is the HTTP client for [configured plugins](https://www.twilio.com/docs/flex/plugins/api/plugin-configuration) endpoints. Available endpoints are:

#### list(configId)

This endpoint lists all configured plugins. The `configId` can either be version of the configuration sid.

#### get(configId, pluginId)

This endpoint fetches the provided configured plugins. The `configId` can either be version of the configuration sid and the `pluginId` can either be the unique name or the plugin sid.

### ReleasesClient

This is the HTTP client for [releases](https://www.twilio.com/docs/flex/plugins/api/release) endpoints. Available endpoints are:

#### list(pagination?: Pagination)

This endpoint lists all releases.

#### active()

This endpoint returns the currently active release.

#### get(releaseId)

This endpoint fetches the provided release. The `releaseId` is the release sid.

#### create(requestObject)

This endpoint creates a new release.

### Pagination

The `list` endpoints can taken an optional `pagination` parameter. The interface for this parameter is and it follows the regular Twilio pagination format:

```ts
interface Pagination {
  pageSize?: number;
  page?: number;
  pageToken?: string;
}
```

The list endpoints return data in the format of:

```
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

The `next_token` and `previous_token` will be parsed from the `next_page_url` and `previous_page_url` if available and can be used to be passed as `Pagination` parameter to the next `list` call.
