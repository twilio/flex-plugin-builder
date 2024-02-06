/* eslint-disable import/no-unused-modules */

import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '../core';
import { spawn, assertion, joinPath } from '../utils';

// Build plugin
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  const ext = scenario.isTS ? 'tsx' : 'jsx';
  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component./,
    to: plugin.componentText,
  });

  await spawn('twilio', ['flex:plugins:build', '-l', 'debug'], { cwd: plugin.dir });

  assertion.not.dirIsEmpty([plugin.dir, 'build']);
  assertion.fileExists([plugin.dir, 'build', `${plugin.name}.js`]);
  assertion.fileExists([plugin.dir, 'build', `${plugin.name}.js.map`]);
  assertion.fileContains([plugin.dir, 'build', `${plugin.name}.js`], plugin.componentText);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
