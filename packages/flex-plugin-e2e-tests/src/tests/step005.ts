/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Build plugin
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  await replaceInFile({
    files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
    from: /This is a dismissible demo component.*/,
    to: params.plugin.componentText,
  });
  const result = await spawn('twilio', ['flex:plugins:build'], { cwd: params.plugin.dir, shell: true });
  logResult(result);

  assertion.not.dirIsEmpty([params.plugin.dir, 'build']);
  assertion.fileExists([params.plugin.dir, 'build', `${params.plugin.name}.js`]);
  assertion.fileExists([params.plugin.dir, 'build', `${params.plugin.name}.js.map`]);
  assertion.fileContains([params.plugin.dir, 'build', `${params.plugin.name}.js`], params.plugin.componentText);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
