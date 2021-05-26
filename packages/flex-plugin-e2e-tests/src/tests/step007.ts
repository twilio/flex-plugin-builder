/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import semver from 'semver';

import { assertion, joinPath, logResult, spawn, api } from '../utils';
import { TestSuite, TestParams } from '..';

// Deploy plugin
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  params.plugin.newlineValue = `This is a dismissible demo component ${Date.now()}`;
  params.plugin.changelog = `e2e test ${Date.now()}`;
  await replaceInFile({
    files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
    from: /This is a dismissible demo component.*/,
    to: params.plugin.newlineValue,
  });

  const resource = await api.getLatestPluginVersion(params.plugin.name);
  params.plugin.version = semver.inc(resource?.version || '0.0.0', 'patch') as string;
  const result = await spawn(
    `${joinPath(params.homeDir, 'twilio')}`,
    ['flex:plugins:deploy', '--changelog', params.plugin.changelog, '--patch'],
    {
      cwd: params.plugin.dir,
      shell: true,
    },
  );
  logResult(result);

  assertion.fileExists([params.plugin.dir, 'build', `${params.plugin.name}.js`]);
  assertion.fileContains([params.plugin.dir, 'build', `${params.plugin.name}.js`], params.plugin.newlineValue);
  assertion.jsonFileContains([params.plugin.dir, 'package.json'], 'version', params.plugin.version);
  assertion.stringContains(result.stdout, 'Next Steps');
  assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
  assertion.stringContains(result.stdout, params.plugin.name);

  const plugin = await api.getPlugin(params.plugin.name);
  const pluginVersion = await api.getPluginVersion(params.plugin.name, params.plugin.version);
  const latest = await api.getLatestPluginVersion(params.plugin.name);

  assertion.equal(plugin.unique_name, params.plugin.name);
  assertion.equal(pluginVersion.version, params.plugin.version);
  assertion.equal(pluginVersion.changelog, params.plugin.changelog);
  assertion.equal(pluginVersion, latest);
};
testSuite.description = 'Running {{twilio flex:plugins:deploy}}';

export default testSuite;
