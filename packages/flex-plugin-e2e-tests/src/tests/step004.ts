/* eslint-disable import/no-unused-modules */
import { logger } from 'flex-plugins-utils-logger';

import { TestSuite, TestParams } from '..';
import { spawn, logResult } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  logger.info('Step 004 - Running {{twilio flex:plugins:test}}');

  const result = await spawn('twilio', ['flex:plugins:test'], { cwd: params.plugin.dir });
  logResult(result);
};

export default testSuite;
