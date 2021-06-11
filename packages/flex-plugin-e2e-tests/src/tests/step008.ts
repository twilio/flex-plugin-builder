/* eslint-disable import/no-unused-modules, @typescript-eslint/no-non-null-assertion */
import { assertion, logResult, spawn, api } from '../utils';
import { TestSuite, TestParams } from '../core';

// Release plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const result = await spawn('twilio', [
    'flex:plugins:release',
    '--plugin',
    `${scenario.plugin.name}@${scenario.plugin.version}`,
    ...config.regionFlag,
  ]);
  logResult(result);

  const release = await api.getActiveRelease();
  const plugins = await api.getActivePlugins(release!.configuration_sid);

  assertion.stringContains(result.stdout, 'successful');
  assertion.stringContains(result.stdout, 'Configuration FJ');
  assertion.stringContains(result.stdout, 'enabled');
  assertion.equal(1, plugins.plugins.length);
  assertion.equal(plugins.plugins[0].unique_name, scenario.plugin.name);
  assertion.equal(plugins.plugins[0].version, scenario.plugin.version);
};
testSuite.description = 'Running {{twilio flex:plugins:release}}';

export default testSuite;
