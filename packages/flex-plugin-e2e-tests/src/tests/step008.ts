/* eslint-disable import/no-unused-modules, @typescript-eslint/no-non-null-assertion */
import { assertion, logResult, spawn, api, sleep } from '../utils';
import { TestSuite, TestParams } from '../core';

// Release plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  const result = await spawn('twilio', [
    'flex:plugins:release',
    '--plugin',
    `${plugin.name}@${plugin.version}`,
    ...config.regionFlag,
  ]);
  logResult(result);
  await sleep(1000);

  const release = await api.getActiveRelease();
  const plugins = await api.getActivePlugins(release!.configuration_sid);

  assertion.stringContains(result.stdout, 'successful');
  assertion.stringContains(result.stdout, 'Configuration FJ');
  assertion.stringContains(result.stdout, 'enabled');
  assertion.equal(1, plugins.plugins.length);
  assertion.equal(plugins.plugins[0].unique_name, plugin.name);
  assertion.equal(plugins.plugins[0].version, plugin.version);
};
testSuite.description = 'Running {{twilio flex:plugins:release}}';

export default testSuite;
