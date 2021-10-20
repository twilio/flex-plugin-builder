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

  // Replace the component text in the 2 other plugins as well if testing multi-plugin
  if (scenario.isMultiPluginRemote || scenario.isMultiPluginVersioned) {
    await replaceInFile({
      files: joinPath(scenario.plugin2.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: /This is a dismissible demo component.*/,
      to: scenario.plugin2.componentText,
    });

    await replaceInFile({
      files: joinPath(scenario.plugin3.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: /This is a dismissible demo component.*/,
      to: scenario.plugin3.componentText,
    });
  }

  const envVariableValue = `${Date.now()}`;

  writeFileSync(`${scenario.plugin.dir}/.env`, `FLEX_APP_ENVIRONMENT_TEST=${envVariableValue}`);

  await replaceInFile({
    files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /close.*/,
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
