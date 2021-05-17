import { DescribeConfiguration } from '../scripts';
import { ConfiguredPlugins } from '../scripts/describeConfiguration';

export interface Difference<T> {
  path: keyof T;
  hasDiff: boolean;
  before: unknown;
  after: unknown;
}

type ConfigurationKeys = Omit<DescribeConfiguration, 'plugins'>;

export type ConfigurationsDiff = {
  configuration: Difference<ConfigurationKeys>[];
  plugins: {
    [key: string]: Difference<ConfiguredPlugins>[];
  };
};

/**
 * Builds a diff
 * @param path  the path to the node
 * @param before  the before value
 * @param after   the after value
 */
export const buildDiff = <T, K extends keyof T, U extends T[K]>(path: keyof T, before: U, after: U): Difference<T> => {
  return {
    path,
    before,
    after,
    hasDiff: before !== after,
  };
};

/**
 * Finds diff between two {@link DescribeConfiguration}
 * @param oldConfig the old {@link DescribeConfiguration}
 * @param newConfig the new {@link DescribeConfiguration}
 */
export const findConfigurationsDiff = (
  oldConfig: DescribeConfiguration,
  newConfig: DescribeConfiguration,
): ConfigurationsDiff => {
  const diffs: ConfigurationsDiff = {
    configuration: [],
    plugins: {},
  };

  buildDiff('name', oldConfig.name, newConfig.name);

  diffs.configuration.push(buildDiff('name', oldConfig.name, newConfig.name));
  diffs.configuration.push(buildDiff('description', oldConfig.description, newConfig.description));
  diffs.configuration.push(buildDiff('isActive', oldConfig.isActive, newConfig.isActive));
  diffs.configuration.push(buildDiff('dateCreated', oldConfig.dateCreated, newConfig.dateCreated));

  oldConfig.plugins.forEach((oldPlugin) => {
    const newPlugin = newConfig.plugins.find((p) => p.pluginSid === oldPlugin.pluginSid);

    // We've already added this, skip
    if (!diffs.plugins[oldPlugin.name]) {
      diffs.plugins[oldPlugin.name] = Object.entries(oldPlugin).map(([key, value]) => {
        return buildDiff(key as keyof ConfiguredPlugins, value, newPlugin && newPlugin[key]);
      });
    }
  });

  newConfig.plugins.forEach((newPlugin) => {
    const oldPlugin = oldConfig.plugins.find((p) => p.pluginSid === newPlugin.pluginSid);

    // We've already added this, skip
    if (!diffs.plugins[newPlugin.name]) {
      diffs.plugins[newPlugin.name] = Object.entries(newPlugin).map(([key, value]) => {
        return buildDiff(key as keyof ConfiguredPlugins, oldPlugin && oldPlugin[key], value);
      });
    }
  });

  return diffs;
};
