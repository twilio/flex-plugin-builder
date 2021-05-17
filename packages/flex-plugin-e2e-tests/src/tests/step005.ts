/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  const newline = `This is a dismissible demo component ${Date.now()}`;
  await replaceInFile({
    files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
    from: /This is a dismissible demo component.*/,
    to: newline,
  });
  const result = await spawn('twilio', ['flex:plugins:build'], { cwd: params.plugin.dir });
  logResult(result);

  assertion.not.dirIsEmpty([params.plugin.dir, 'build']);
  assertion.fileExists([params.plugin.dir, 'build', `${params.plugin.name}.js`]);
  assertion.fileExists([params.plugin.dir, 'build', `${params.plugin.name}.js.map`]);
  assertion.fileContains([params.plugin.dir, 'build', `${params.plugin.name}.js`], newline);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
