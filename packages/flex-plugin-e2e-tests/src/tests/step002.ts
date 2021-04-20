/* eslint-disable import/no-unused-modules, sonarjs/no-duplicate-string */
import { logger } from 'flex-plugins-utils-logger';

import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion } from '../utils';

// Install Twilio CLI and Plugins CLI
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  logger.info('Step 002 - Creating a Plugin');

  const twilioCliResult = await spawn('twilio', 'flex:plugins:create', params.plugin.name);
  logResult(twilioCliResult);

  const dir = `${params.homeDir}/${params.plugin.name}`;

  // Assert files/directories exist
  assertion.fileExists([dir], 'Plugin directory does not exist');
  assertion.fileExists([dir, 'src']);
  assertion.fileExists([dir, 'public']);
  assertion.fileExists([dir, 'package.json']);
  assertion.fileExists([dir, 'webpack.config.js']);
  assertion.fileExists([dir, 'webpack.dev.js']);
  assertion.fileExists([dir, 'jest.config.js']);
  assertion.fileExists([dir, 'public', 'appConfig.js']);
  assertion.fileExists([dir, 'public', 'appConfig.example.js']);
  assertion.not.fileExists([dir, 'public', 'plugins.json']);

  // Assert package.json
  assertion.jsonFileContains([dir, 'package.json'], "dependencies['flex-plugin-scripts']", `^${params.packageVersion}`);
  assertion.jsonFileContains([dir, 'package.json'], "dependencies['react']", `16.5.2`);
  assertion.jsonFileContains([dir, 'package.json'], "dependencies['react-dom']", `16.5.2`);
  assertion.jsonFileContains([dir, 'package.json'], "devDependencies['react-test-renderer']", `16.5.2`);
};

export default testSuite;
