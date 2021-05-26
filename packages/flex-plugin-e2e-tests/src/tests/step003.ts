/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion } from '../utils';

// Install dependencies
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  const result = await spawn('npm', ['i'], { cwd: params.plugin.dir, shell: true });
  logResult(result);

  assertion.fileExists([params.plugin.dir, 'node_modules']);
  assertion.fileExists([params.plugin.dir, 'node_modules', 'flex-plugin-scripts']);
  assertion.jsonFileContains(
    [params.plugin.dir, 'node_modules', 'flex-plugin-scripts', 'package.json'],
    'version',
    params.packageVersion,
  );
};
testSuite.description = 'Running {{npm i}}';

export default testSuite;
