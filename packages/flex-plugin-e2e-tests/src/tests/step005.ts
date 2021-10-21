/* eslint-disable import/no-unused-modules */
import { writeFileSync } from 'fs';

import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '../core';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Build plugin
const testSuite: TestSuite = async ({ scenario }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  await replaceInFile({
    files: joinPath(scenario.plugins[0].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugins[0].componentText,
  });

  const envVariableValue = `${Date.now()}`;

  writeFileSync(`${scenario.plugins[0].dir}/.env`, `FLEX_APP_ENVIRONMENT_TEST=${envVariableValue}`);

  await replaceInFile({
    files: joinPath(scenario.plugins[0].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /close.*/,
    to: `close-{process.env.FLEX_APP_ENVIRONMENT_TEST}`,
    countMatches: true,
  });

  const result = await spawn('twilio', ['flex:plugins:build'], { cwd: scenario.plugins[0].dir });
  logResult(result);

  assertion.not.dirIsEmpty([scenario.plugins[0].dir, 'build']);
  assertion.fileExists([scenario.plugins[0].dir, 'build', `${scenario.plugins[0].name}.js`]);
  assertion.fileExists([scenario.plugins[0].dir, 'build', `${scenario.plugins[0].name}.js.map`]);
  assertion.fileContains(
    [scenario.plugins[0].dir, 'build', `${scenario.plugins[0].name}.js`],
    scenario.plugins[0].componentText,
  );
  assertion.fileContains([scenario.plugins[0].dir, 'build', `${scenario.plugins[0].name}.js`], envVariableValue);
};
testSuite.description = 'Running {{twilio flex:plugins:build}}';

export default testSuite;
