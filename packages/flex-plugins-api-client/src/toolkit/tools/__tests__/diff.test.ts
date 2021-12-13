import { DescribeConfiguration } from '../../scripts';
import { ConfigurationsDiff, findConfigurationsDiff } from '../diff';

describe('diff', () => {
  const config: DescribeConfiguration = {
    sid: 'FJ00000000000000000000000000000000',
    name: 'old-name',
    description: 'old-description',
    isActive: true,
    isArchived: false,
    plugins: [],
    dateCreated: 'old-date-created',
  };
  const pluginUrl100 = 'https://twilio.com/1.0.0';
  const pluginUrl110 = 'https://twilio.com/1.1.0';
  const pluginOneFriendlyName = 'plugin one';
  const pluginOneDescription = 'plugin one description';
  const versionChangelog = 'changelog one';
  const newVersionChangelog = 'changelog one change';

  const expectConfigurationDiff = (
    diffs: ConfigurationsDiff,
    oldConfig: DescribeConfiguration,
    newConfig: DescribeConfiguration,
  ) => {
    expect(diffs.configuration).toHaveLength(4);

    expect(diffs.configuration[0].path).toEqual('name');
    expect(diffs.configuration[0].before).toEqual(oldConfig.name);
    expect(diffs.configuration[0].after).toEqual(newConfig.name);

    expect(diffs.configuration[1].path).toEqual('description');
    expect(diffs.configuration[1].before).toEqual(oldConfig.description);
    expect(diffs.configuration[1].after).toEqual(newConfig.description);

    expect(diffs.configuration[2].path).toEqual('isActive');
    expect(diffs.configuration[2].before).toEqual(oldConfig.isActive);
    expect(diffs.configuration[2].after).toEqual(newConfig.isActive);

    expect(diffs.configuration[3].path).toEqual('dateCreated');
    expect(diffs.configuration[3].before).toEqual(oldConfig.dateCreated);
    expect(diffs.configuration[3].after).toEqual(newConfig.dateCreated);
  };

  const findPluginDiff = (diffs: ConfigurationsDiff, name: string, path: string) => {
    const plugin = diffs.plugins[name];
    if (!plugin) {
      throw new Error('no plugin was found');
    }
    const diff = plugin.find((p) => p.path === path);
    if (!diff) {
      throw new Error('no diff was found');
    }

    return diff;
  };

  it('should add diff of name', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      name: 'new-name',
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);
    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.configuration[0].before).not.toEqual(diffs.configuration[0].after);
    expect(diffs.configuration[1].before).toEqual(diffs.configuration[1].after);
    expect(diffs.configuration[2].before).toEqual(diffs.configuration[2].after);
    expect(diffs.configuration[3].before).toEqual(diffs.configuration[3].after);
  });

  it('should add diff of description', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      description: 'new-name',
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);
    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.configuration[0].before).toEqual(diffs.configuration[0].after);
    expect(diffs.configuration[1].before).not.toEqual(diffs.configuration[1].after);
    expect(diffs.configuration[2].before).toEqual(diffs.configuration[2].after);
    expect(diffs.configuration[3].before).toEqual(diffs.configuration[3].after);
  });

  it('should add diff of isActive', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      isActive: false,
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);
    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.configuration[0].before).toEqual(diffs.configuration[0].after);
    expect(diffs.configuration[1].before).toEqual(diffs.configuration[1].after);
    expect(diffs.configuration[2].before).not.toEqual(diffs.configuration[2].after);
    expect(diffs.configuration[3].before).toEqual(diffs.configuration[3].after);
  });

  it('should add diff of dateCreated', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      dateCreated: 'new-date-created',
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);
    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.configuration[0].before).toEqual(diffs.configuration[0].after);
    expect(diffs.configuration[1].before).toEqual(diffs.configuration[1].after);
    expect(diffs.configuration[2].before).toEqual(diffs.configuration[2].after);
    expect(diffs.configuration[3].before).not.toEqual(diffs.configuration[3].after);
  });

  it('should diff plugin change one way', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
      plugins: [
        {
          pluginSid: 'FP00000000000000000000000000000000',
          pluginVersionSid: 'FV00000000000000000000000000000000',
          name: 'plugin-1',
          version: '1.0.0',
          url: pluginUrl100,
          friendlyName: pluginOneFriendlyName,
          description: pluginOneDescription,
          changelog: versionChangelog,
          isPrivate: true,
          isArchived: false,
          phase: 3,
        },
      ],
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      plugins: [
        {
          pluginSid: 'FP00000000000000000000000000000000',
          pluginVersionSid: 'FV00000000000000000000000000000001',
          name: 'plugin-1',
          version: '1.1.0',
          url: pluginUrl110,
          friendlyName: pluginOneFriendlyName,
          description: pluginOneDescription,
          changelog: newVersionChangelog,
          isPrivate: true,
          isArchived: true,
          phase: 4,
        },
      ],
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);

    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.plugins).toHaveProperty('plugin-1');
    expect(diffs.plugins['plugin-1']).toHaveLength(11);

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').before).toEqual('FP00000000000000000000000000000000');
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').after).toEqual('FP00000000000000000000000000000000');

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').before).toEqual('FV00000000000000000000000000000000');
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').after).toEqual('FV00000000000000000000000000000001');

    expect(findPluginDiff(diffs, 'plugin-1', 'name').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'name').before).toEqual('plugin-1');
    expect(findPluginDiff(diffs, 'plugin-1', 'name').after).toEqual('plugin-1');

    expect(findPluginDiff(diffs, 'plugin-1', 'version').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'version').before).toEqual('1.0.0');
    expect(findPluginDiff(diffs, 'plugin-1', 'version').after).toEqual('1.1.0');

    expect(findPluginDiff(diffs, 'plugin-1', 'url').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').before).toEqual(pluginUrl100);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').after).toEqual(pluginUrl110);

    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').before).toEqual(pluginOneFriendlyName);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').after).toEqual(pluginOneFriendlyName);

    expect(findPluginDiff(diffs, 'plugin-1', 'description').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').before).toEqual(pluginOneDescription);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').after).toEqual(pluginOneDescription);

    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').before).toEqual(versionChangelog);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').after).toEqual(newVersionChangelog);

    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').before).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').after).toEqual(true);

    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').before).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').after).toEqual(true);

    expect(findPluginDiff(diffs, 'plugin-1', 'phase').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').before).toEqual(3);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').after).toEqual(4);
  });

  it('should diff plugin change the other way', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
      plugins: [
        {
          pluginSid: 'FP00000000000000000000000000000000',
          pluginVersionSid: 'FV00000000000000000000000000000000',
          name: 'plugin-1',
          version: '1.0.0',
          url: pluginUrl100,
          friendlyName: pluginOneFriendlyName,
          description: pluginOneDescription,
          changelog: versionChangelog,
          isPrivate: true,
          isArchived: false,
          phase: 3,
        },
      ],
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      plugins: [
        {
          pluginSid: 'FP00000000000000000000000000000000',
          pluginVersionSid: 'FV00000000000000000000000000000001',
          name: 'plugin-1',
          version: '1.1.0',
          url: pluginUrl110,
          friendlyName: pluginOneFriendlyName,
          description: pluginOneDescription,
          changelog: newVersionChangelog,
          isPrivate: true,
          isArchived: false,
          phase: 4,
        },
      ],
    };

    const diffs = findConfigurationsDiff(newConfig, oldConfig);

    expectConfigurationDiff(diffs, newConfig, oldConfig);
    expect(diffs.plugins).toHaveProperty('plugin-1');
    expect(diffs.plugins['plugin-1']).toHaveLength(11);

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').after).toEqual('FP00000000000000000000000000000000');
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').before).toEqual('FP00000000000000000000000000000000');

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').after).toEqual('FV00000000000000000000000000000000');
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').before).toEqual('FV00000000000000000000000000000001');

    expect(findPluginDiff(diffs, 'plugin-1', 'name').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'name').after).toEqual('plugin-1');
    expect(findPluginDiff(diffs, 'plugin-1', 'name').before).toEqual('plugin-1');

    expect(findPluginDiff(diffs, 'plugin-1', 'version').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'version').after).toEqual('1.0.0');
    expect(findPluginDiff(diffs, 'plugin-1', 'version').before).toEqual('1.1.0');

    expect(findPluginDiff(diffs, 'plugin-1', 'url').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').after).toEqual(pluginUrl100);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').before).toEqual(pluginUrl110);

    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').after).toEqual(pluginOneFriendlyName);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').before).toEqual(pluginOneFriendlyName);

    expect(findPluginDiff(diffs, 'plugin-1', 'description').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').after).toEqual(pluginOneDescription);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').before).toEqual(pluginOneDescription);

    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').after).toEqual(versionChangelog);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').before).toEqual(newVersionChangelog);

    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').after).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').before).toEqual(true);

    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').hasDiff).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').before).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').after).toEqual(false);

    expect(findPluginDiff(diffs, 'plugin-1', 'phase').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').after).toEqual(3);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').before).toEqual(4);
  });

  it('should diff plugin added', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
    };
    const newConfig: DescribeConfiguration = {
      ...config,
      plugins: [
        {
          pluginSid: 'FP00000000000000000000000000000000',
          pluginVersionSid: 'FV00000000000000000000000000000001',
          name: 'plugin-1',
          version: '1.1.0',
          url: pluginUrl110,
          friendlyName: pluginOneFriendlyName,
          description: pluginOneDescription,
          changelog: newVersionChangelog,
          isPrivate: true,
          isArchived: false,
          phase: 4,
        },
      ],
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);

    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.plugins).toHaveProperty('plugin-1');
    expect(diffs.plugins['plugin-1']).toHaveLength(11);

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').after).toEqual('FP00000000000000000000000000000000');

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').after).toEqual('FV00000000000000000000000000000001');

    expect(findPluginDiff(diffs, 'plugin-1', 'name').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'name').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'name').after).toEqual('plugin-1');

    expect(findPluginDiff(diffs, 'plugin-1', 'version').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'version').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'version').after).toEqual('1.1.0');

    expect(findPluginDiff(diffs, 'plugin-1', 'url').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'url').after).toEqual(pluginUrl110);

    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').after).toEqual(pluginOneFriendlyName);

    expect(findPluginDiff(diffs, 'plugin-1', 'description').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'description').after).toEqual(pluginOneDescription);

    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').after).toEqual(newVersionChangelog);

    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').after).toEqual(true);

    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').after).toEqual(false);

    expect(findPluginDiff(diffs, 'plugin-1', 'phase').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').before).toBeUndefined();
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').after).toEqual(4);
  });

  it('should diff plugin removed', () => {
    const oldConfig: DescribeConfiguration = {
      ...config,
      plugins: [
        {
          pluginSid: 'FP00000000000000000000000000000000',
          pluginVersionSid: 'FV00000000000000000000000000000000',
          name: 'plugin-1',
          version: '1.0.0',
          url: pluginUrl100,
          friendlyName: pluginOneFriendlyName,
          description: pluginOneDescription,
          changelog: versionChangelog,
          isPrivate: true,
          isArchived: false,
          phase: 3,
        },
      ],
    };
    const newConfig: DescribeConfiguration = {
      ...config,
    };

    const diffs = findConfigurationsDiff(oldConfig, newConfig);

    expectConfigurationDiff(diffs, oldConfig, newConfig);
    expect(diffs.plugins).toHaveProperty('plugin-1');
    expect(diffs.plugins['plugin-1']).toHaveLength(11);

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').before).toEqual('FP00000000000000000000000000000000');
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginSid').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').before).toEqual('FV00000000000000000000000000000000');
    expect(findPluginDiff(diffs, 'plugin-1', 'pluginVersionSid').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'name').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'name').before).toEqual('plugin-1');
    expect(findPluginDiff(diffs, 'plugin-1', 'name').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'version').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'version').before).toEqual('1.0.0');
    expect(findPluginDiff(diffs, 'plugin-1', 'version').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'url').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').before).toEqual(pluginUrl100);
    expect(findPluginDiff(diffs, 'plugin-1', 'url').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').before).toEqual(pluginOneFriendlyName);
    expect(findPluginDiff(diffs, 'plugin-1', 'friendlyName').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'description').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').before).toEqual(pluginOneDescription);
    expect(findPluginDiff(diffs, 'plugin-1', 'description').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').before).toEqual(versionChangelog);
    expect(findPluginDiff(diffs, 'plugin-1', 'changelog').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').before).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isPrivate').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').before).toEqual(false);
    expect(findPluginDiff(diffs, 'plugin-1', 'isArchived').after).toBeUndefined();

    expect(findPluginDiff(diffs, 'plugin-1', 'phase').hasDiff).toEqual(true);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').before).toEqual(3);
    expect(findPluginDiff(diffs, 'plugin-1', 'phase').after).toBeUndefined();
  });
});
