/* eslint-disable import/no-unused-modules */
import { logger } from '@twilio/flex-dev-utils';

import { TestSuite, TestParams } from '../core';
import { spawn } from '../utils';

// Run plugin tests
const testSuite: TestSuite = async ({ scenario, environment }: TestParams): Promise<void> => {
  // To be addressed in future PR
  if (environment.operatingSystem === 'win32') {
    logger.warning('Skipping [flex:plugins:test] on Win32');
  } else {
    await spawn('twilio', ['flex:plugins:test', '-l', 'debug'], {
      cwd: scenario.plugins[1].dir,
    });
  }
};
testSuite.description = 'Running {{twilio flex:plugins:test}}';

export default testSuite;
