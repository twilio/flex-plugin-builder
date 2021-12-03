/* eslint-disable import/no-unused-modules */
import { writeFileSync } from 'fs';

import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '../core';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Build plugin
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  const ext = scenario.isTS ? 'tsx' : 'jsx';
  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: plugin.componentText,
  });

  const envVariableValue = `${Date.now()}`;

  writeFileSync(`${plugin.dir}/.env`, `FLEX_APP_ENVIRONMENT_TEST=${envVariableValue}`);

  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /close.*/,
    to: `close-{process.env.FLEX_APP_ENVIRONMENT_TEST}`,
    countMatches: true,
  });

  const result = await spawn('twilio', ['flex:plugins:build', '-l', 'debug'], { cwd: plugin.dir });
  logResult(result);

  assertion.not.dirIsEmpty([plugin.dir, 'build']);
  assertion.fileExists([plugin.dir, 'build', `${plugin.name}.js`]);
  assertion.fileExists([plugin.dir, 'build', `${plugin.name}.js.map`]);
  assertion.fileContains([plugin.dir, 'build', `${plugin.name}.js`], plugin.componentText);
  assertion.fileContains([plugin.dir, 'build', `${plugin.name}.js`], envVariableValue);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
