/* eslint-disable import/no-unused-modules, sonarjs/no-duplicate-string */
import { TestSuite, TestParams } from '..';
import { spawn, logResult, assertion } from '../utils';

// Create a plugin
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  const twilioCliResult = await spawn('twilio', ['flex:plugins:create', params.plugin.name], {
    shell: true,
  });
  logResult(twilioCliResult);

  // Assert files/directories exist
  assertion.fileExists([params.plugin.dir], 'Plugin directory does not exist');
  assertion.fileExists([params.plugin.dir, 'src']);
  assertion.fileExists([params.plugin.dir, 'src', 'components']);
  assertion.fileExists([params.plugin.dir, 'src', 'components', '__tests__']);
  assertion.not.dirIsEmpty([params.plugin.dir, 'src', 'components', '__tests__']);
  assertion.fileExists([params.plugin.dir, 'public']);
  assertion.fileExists([params.plugin.dir, 'package.json']);
  assertion.fileExists([params.plugin.dir, 'webpack.config.js']);
  assertion.fileExists([params.plugin.dir, 'webpack.dev.js']);
  assertion.fileExists([params.plugin.dir, 'jest.config.js']);
  assertion.fileExists([params.plugin.dir, 'public', 'appConfig.js']);
  assertion.fileExists([params.plugin.dir, 'public', 'appConfig.example.js']);

  // Assert package.json
  assertion.jsonFileContains(
    [params.plugin.dir, 'package.json'],
    "dependencies['flex-plugin-scripts']",
    params.packageVersion,
  );
  assertion.jsonFileContains([params.plugin.dir, 'package.json'], "dependencies['react']", `16.5.2`);
  assertion.jsonFileContains([params.plugin.dir, 'package.json'], "dependencies['react-dom']", `16.5.2`);
  assertion.jsonFileContains([params.plugin.dir, 'package.json'], "devDependencies['react-test-renderer']", `16.5.2`);
};
testSuite.description = 'Creating a Plugin';

export default testSuite;
