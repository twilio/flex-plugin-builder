/* eslint-disable import/no-unused-modules */
import { logger } from 'flex-plugins-utils-logger';

import { TestSuite, TestParams } from '../core';
import { spawn, logResult } from '../utils';

// Run plugin tests
const testSuite: TestSuite = async ({ scenario, environment }: TestParams): Promise<void> => {
  // To be addressed in future PR
  if (environment.operatingSystem === 'win32') {
    logger.warning('Skipping [flex:plugins:test] on Win32');
  } else {
    const result = await spawn('twilio', ['flex:plugins:test'], {
      cwd: scenario.plugin.dir,
    });
    logResult(result);
  }
};
testSuite.description = 'Running {{twilio flex:plugins:test}}';

export default testSuite;
