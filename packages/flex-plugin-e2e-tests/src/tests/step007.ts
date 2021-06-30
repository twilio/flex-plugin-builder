/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import semver from 'semver';

import { assertion, joinPath, logResult, spawn, api } from '../utils';
import { TestSuite, TestParams } from '../core';

// Deploy plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  scenario.plugin.newlineValue = `This is a dismissible demo component ${Date.now()}`;
  scenario.plugin.changelog = `e2e test ${Date.now()}`;
  await replaceInFile({
    files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugin.newlineValue,
  });

  const resource = await api.getLatestPluginVersion(scenario.plugin.name);
  scenario.plugin.version = semver.inc(resource?.version || '0.0.0', 'patch') as string;
  const result = await spawn(
    'twilio',
    ['flex:plugins:deploy', '--changelog', `"${scenario.plugin.changelog}"`, '--patch', ...config.regionFlag],
    {
      cwd: scenario.plugin.dir,
    },
  );
  logResult(result);

  assertion.fileExists([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`]);
  assertion.fileContains([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`], scenario.plugin.newlineValue);
  assertion.jsonFileContains([scenario.plugin.dir, 'package.json'], 'version', scenario.plugin.version);
  assertion.stringContains(result.stdout, 'Next Steps');
  assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
  assertion.stringContains(result.stdout, scenario.plugin.name);

  const plugin = await api.getPlugin(scenario.plugin.name);
  const pluginVersion = await api.getPluginVersion(scenario.plugin.name, scenario.plugin.version);
  const latest = await api.getLatestPluginVersion(scenario.plugin.name);

  assertion.equal(plugin.unique_name, scenario.plugin.name);
  assertion.equal(pluginVersion.version, scenario.plugin.version);
  assertion.equal(pluginVersion.changelog, scenario.plugin.changelog);
  assertion.equal(pluginVersion, latest);
};
testSuite.description = 'Running {{twilio flex:plugins:deploy}}';

export default testSuite;
