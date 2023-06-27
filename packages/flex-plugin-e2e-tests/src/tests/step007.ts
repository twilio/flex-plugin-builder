/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import semver from 'semver';

import { assertion, joinPath, spawn, api } from '../utils';
import { TestSuite, TestParams } from '../core';

// Deploy plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[1];
  assertion.not.isNull(plugin);

  const ext = scenario.isTS ? 'tsx' : 'jsx';
  plugin.newlineValue = `This is a dismissible demo component ${Date.now()}`;
  plugin.changelog = `e2e test ${Date.now()}`;
  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: plugin.newlineValue,
  });

  const resource = await api.getLatestPluginVersion(plugin.name);
  plugin.version = semver.inc(resource?.version || '0.0.0', 'patch') as string;
  const result = await spawn(
    'twilio',
    ['flex:plugins:deploy', '--changelog', `"${plugin.changelog}"`, '--patch', '-l', 'debug', ...config.regionFlag],
    {
      cwd: plugin.dir,
    },
  );

  assertion.fileExists([plugin.dir, 'build', `${plugin.name}.js`]);
  assertion.fileContains([plugin.dir, 'build', `${plugin.name}.js`], plugin.newlineValue);
  assertion.jsonFileContains([plugin.dir, 'package.json'], 'version', plugin.version);
  assertion.stringContains(result.stdout, 'Next Steps');
  assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
  assertion.stringContains(result.stdout, plugin.name);

  const apiPlugin = await api.getPlugin(plugin.name);
  const pluginVersion = await api.getPluginVersion(plugin.name, plugin.version);
  const latest = await api.getLatestPluginVersion(plugin.name);

  assertion.equal(apiPlugin.unique_name, plugin.name);
  assertion.equal(pluginVersion.version, plugin.version);
  assertion.equal(pluginVersion.changelog, plugin.changelog);
  assertion.equal(pluginVersion, latest);
};
testSuite.description = 'Running {{twilio flex:plugins:deploy}}';

export default testSuite;
