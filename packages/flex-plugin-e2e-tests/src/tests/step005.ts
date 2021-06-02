/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '../core';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Build plugin
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  await replaceInFile({
    files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugin.componentText,
  });
  const result = await spawn('twilio', ['flex:plugins:build'], { cwd: scenario.plugin.dir });
  logResult(result);

  assertion.not.dirIsEmpty([scenario.plugin.dir, 'build']);
  assertion.fileExists([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`]);
  assertion.fileExists([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js.map`]);
  assertion.fileContains([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`], scenario.plugin.componentText);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
