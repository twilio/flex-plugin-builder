/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '../core';
import { spawn, logResult } from '../utils';

// Run plugin tests
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const result = await spawn('twilio', ['flex:plugins:test'], { cwd: scenario.plugin.dir });
  logResult(result);
};
testSuite.description = 'Running {{twilio flex:plugins:test}}';

export default testSuite;
