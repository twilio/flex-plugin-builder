/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '..';
import { spawn, logResult } from '../utils';

// Run plugin tests
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  const result = await spawn('twilio', ['flex:plugins:test'], { cwd: params.plugin.dir });
  logResult(result);
};
testSuite.description = 'Running {{twilio flex:plugins:test}}';

export default testSuite;
