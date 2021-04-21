/* eslint-disable import/no-unused-modules */
import { logger } from 'flex-plugins-utils-logger';
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion, joinPath } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  logger.info('Step 005 - Running {{twilio flex:plugins:build}}');

  const newline = `This is a dismissible demo component ${new Date()}`;
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

export default testSuite;
