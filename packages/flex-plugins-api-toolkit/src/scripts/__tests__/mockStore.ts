import {
  ConfigurationResource,
  ConfiguredPluginResource,
  PluginResource,
  PluginVersionResource,
  ReleaseResource,
} from 'flex-plugins-api-client';

import { DescribeConfiguration } from '../describeConfiguration';

export const meta = {
  page: 1,
  page_size: 100,
  first_page_url: '',
  previous_page_url: '',
  url: '',
  key: '',
};

export const plugin: PluginResource = {
  sid: 'FP123',
  account_sid: 'AC123',
  unique_name: 'test-plugin',
  description: '',
  friendly_name: '',
  archived: false,
  date_created: 'some-date',
  date_updated: 'some-date',
};

export const version: PluginVersionResource = {
  sid: 'FV123',
  account_sid: 'AC123',
  plugin_sid: 'FP123',
  plugin_url: 'https://twilio.com',
  version: '1.2.3',
  private: false,
  changelog: '',
  archived: false,
  date_created: 'some-date',
};

export const configuration: ConfigurationResource = {
  sid: 'FJ123',
  account_sid: 'AC123',
  name: 'some name',
  description: 'the-description',
  archived: false,
  date_created: 'some-date',
};

export const installedPlugin: ConfiguredPluginResource = {
  plugin_sid: 'FP123',
  plugin_version_sid: 'FV123',
  configuration_sid: 'FJ123',
  unique_name: plugin.unique_name,
  version: version.version,
  plugin_url: version.plugin_url,
  phase: 3,
  private: version.private,
  date_created: 'some-date',
};

export const release: ReleaseResource = {
  sid: 'FK123',
  account_sid: 'AC123',
  configuration_sid: 'FJ123',
  date_created: 'some-date',
};

export const describeConfiguration: DescribeConfiguration = {
  sid: 'FJ0000000000000000000000000000000',
  name: 'configuration-name',
  description: 'description',
  isActive: true,
  isArchived: false,
  plugins: [],
  dateCreated: 'some-date',
};
