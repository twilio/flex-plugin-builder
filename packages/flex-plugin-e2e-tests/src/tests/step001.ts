/* eslint-disable import/no-unused-modules, no-console */
import { TestSuite, TestParams } from '..';
import spawn, { logResult } from '../utils/spawn';
import { logger } from 'flex-plugins-utils-logger';


// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  logger.info('Step 001 - Installing Twilio CLI and Plugins CLI');

  const twilioCliResult = await spawn('npm', 'install', '-g', 'twilio-cli');
  logResult(twilioCliResult);

  const pluginsCliResult = await spawn('twilio', 'plugins:install', `@twilio-labs/plugin-flex@${params.packageVersion}`);
  logResult(pluginsCliResult);
};

export default testSuite;
