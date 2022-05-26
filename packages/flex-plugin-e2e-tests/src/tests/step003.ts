/* eslint-disable import/no-unused-modules */

import { TestSuite, TestParams } from '../core';
import { spawn, assertion, pluginHelper } from '../utils';

// Install dependencies
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  pluginHelper.changeFlexUIVersionIfRequired(scenario, plugin);

  await spawn('npm', ['i'], { cwd: plugin.dir });

  assertion.fileExists([plugin.dir, 'node_modules']);
  assertion.fileExists([plugin.dir, 'node_modules', '@twilio/flex-plugin-scripts']);
  assertion.jsonFileContains(
    [plugin.dir, 'node_modules', '@twilio/flex-plugin-scripts', 'package.json'],
    'version',
    scenario.packageVersion,
  );
};
testSuite.description = 'Running {{npm i}}';

export default testSuite;
