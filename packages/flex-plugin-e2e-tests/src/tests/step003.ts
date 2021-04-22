/* eslint-disable import/no-unused-modules */
import { logger } from 'flex-plugins-utils-logger';

import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  logger.info('Step 003 - Running {{npm i}}');

  const result = await spawn('npm', ['i'], { cwd: params.plugin.dir });
  logResult(result);

  assertion.fileExists([params.plugin.dir, 'node_modules']);
  assertion.fileExists([params.plugin.dir, 'node_modules', 'flex-plugin-scripts']);
  assertion.jsonFileContains(
    [params.plugin.dir, 'node_modules', 'flex-plugin-scripts', 'package.json'],
    'version',
    params.packageVersion,
  );
};

export default testSuite;
