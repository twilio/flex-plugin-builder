/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '../core';
import { spawn, logResult, assertion } from '../utils';

// Install dependencies
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const result = await spawn('npm', ['i'], { cwd: scenario.plugin.dir });
  logResult(result);

  assertion.fileExists([scenario.plugin.dir, 'node_modules']);
  assertion.fileExists([scenario.plugin.dir, 'node_modules', 'flex-plugin-scripts']);
  assertion.jsonFileContains(
    [scenario.plugin.dir, 'node_modules', 'flex-plugin-scripts', 'package.json'],
    'version',
    scenario.packageVersion,
  );
};
testSuite.description = 'Running {{npm i}}';

export default testSuite;
