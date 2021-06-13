/* eslint-disable import/no-unused-modules */
import { writeFileSync } from 'fs';

import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '../core';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Build plugin
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  await replaceInFile({
    files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugin.componentText,
  });

  const envVariableValue = `close-${Date.now()}`;

  writeFileSync(`${scenario.plugin.dir}/.env`, `FLEX_APP_ENVIRONMENT_TEST=${envVariableValue}`);

  await replaceInFile({
    files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /(close(?!-))|(close-{process.env.FLEX_APP_ENVIRONMENT_TEST})/,
    to: `close-{process.env.FLEX_APP_ENVIRONMENT_TEST}`,
    countMatches: true,
  });

  const result = await spawn('twilio', ['flex:plugins:build'], { cwd: scenario.plugin.dir });
  logResult(result);

  assertion.not.dirIsEmpty([scenario.plugin.dir, 'build']);
  assertion.fileExists([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`]);
  assertion.fileExists([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js.map`]);
  assertion.fileContains([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`], scenario.plugin.componentText);
  assertion.fileContains([scenario.plugin.dir, 'build', `${scenario.plugin.name}.js`], envVariableValue);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
