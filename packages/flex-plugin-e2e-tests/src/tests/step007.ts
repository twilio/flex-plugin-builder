/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import semver from 'semver';

import { assertion, joinPath, logResult, spawn, api } from '../utils';
import { TestSuite, TestParams } from '../core';

// Deploy plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  scenario.plugins[0].newlineValue = `This is a dismissible demo component ${Date.now()}`;
  scenario.plugins[0].changelog = `e2e test ${Date.now()}`;
  await replaceInFile({
    files: joinPath(scenario.plugins[0].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugins[0].newlineValue,
  });

  const resource = await api.getLatestPluginVersion(scenario.plugins[0].name);
  scenario.plugins[0].version = semver.inc(resource?.version || '0.0.0', 'patch') as string;
  const result = await spawn(
    'twilio',
    ['flex:plugins:deploy', '--changelog', `"${scenario.plugins[0].changelog}"`, '--patch', ...config.regionFlag],
    {
      cwd: scenario.plugins[0].dir,
    },
  );
  logResult(result); 

  assertion.fileExists([scenario.plugins[0].dir, 'build', `${scenario.plugins[0].name}.js`]);
  assertion.fileContains(
    [scenario.plugins[0].dir, 'build', `${scenario.plugins[0].name}.js`],
    scenario.plugins[0].newlineValue,
  );
  assertion.jsonFileContains([scenario.plugins[0].dir, 'package.json'], 'version', scenario.plugins[0].version);
  assertion.stringContains(result.stdout, 'Next Steps');
  assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
  assertion.stringContains(result.stdout, scenario.plugins[0].name);

  const plugin = await api.getPlugin(scenario.plugins[0].name);
  const pluginVersion = await api.getPluginVersion(scenario.plugins[0].name, scenario.plugins[0].version);
  const latest = await api.getLatestPluginVersion(scenario.plugins[0].name);

  assertion.equal(plugin.unique_name, scenario.plugins[0].name);
  assertion.equal(pluginVersion.version, scenario.plugins[0].version);
  assertion.equal(pluginVersion.changelog, scenario.plugins[0].changelog);
  assertion.equal(pluginVersion, latest);
};
testSuite.description = 'Running {{twilio flex:plugins:deploy}}';

export default testSuite;
