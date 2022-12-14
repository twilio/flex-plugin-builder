/* eslint-disable import/no-unused-modules, sonarjs/no-duplicate-string */
import { TestSuite, TestParams } from '../core';
import { spawn, assertion, joinPath, writeFileSync } from '../utils';

// Create a plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const flags: string[] = [];

  if (scenario.isTS) {
    flags.push('--typescript');
  }
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  await spawn('twilio', ['flex:plugins:create', plugin.name, ...flags]);

  // Assert files/directories exist
  assertion.fileExists([plugin.dir], 'Plugin directory does not exist');
  assertion.fileExists([plugin.dir], 'Plugin directory does not exist');
  assertion.fileExists([plugin.dir, 'src']);
  assertion.fileExists([plugin.dir, 'src', 'components']);
  assertion.fileExists([plugin.dir, 'src', 'components', '__tests__']);
  assertion.not.dirIsEmpty([plugin.dir, 'src', 'components', '__tests__']);
  assertion.fileExists([plugin.dir, 'public']);
  assertion.fileExists([plugin.dir, 'package.json']);
  assertion.fileExists([plugin.dir, 'webpack.config.js']);
  assertion.fileExists([plugin.dir, 'webpack.dev.js']);
  assertion.fileExists([plugin.dir, 'jest.config.js']);
  assertion.fileExists([plugin.dir, 'public', 'appConfig.js']);
  assertion.fileExists([plugin.dir, 'public', 'appConfig.example.js']);

  // Assert package.json
  assertion.jsonFileContains(
    [plugin.dir, 'package.json'],
    "dependencies['@twilio/flex-plugin-scripts']",
    scenario.packageVersion,
  );

  assertion.jsonFileContains([plugin.dir, 'package.json'], "dependencies['react']", `16.5.2`);
  assertion.jsonFileContains([plugin.dir, 'package.json'], "dependencies['react-dom']", `16.5.2`);
  assertion.jsonFileContains([plugin.dir, 'package.json'], "devDependencies['react-test-renderer']", `16.5.2`);

  const { region } = config;
  if (region) {
    const appConfig = {
      pluginService: {
        enabled: true,
        url: '/plugins',
      },
      logLevel: 'info',
      flexConfigServiceUrl: `https://flex-api.${region}.twilio.com/v1/Configuration`,
      sdkOptions: {
        chat: {
          region: 'stage-us1',
        },
        worker: {
          ebServer: `https://event-bridge.${region}-us1.twilio.com/v1/wschannels`,
          wsServer: `wss://event-bridge.${region}-us1.twilio.com/v1/wschannels`,
        },
        insights: {
          productId: 'flex_insights',
          region: `${region}-us1`,
        },
        voice: {
          chunderw: `chunderw-vpc-gll.${region}.twilio.com`,
          eventgw: `eventgw.${region}.twilio.com`,
        },
      },
    };

    writeFileSync(joinPath(plugin.dir, 'public', 'appConfig.js'), `var appConfig = ${JSON.stringify(appConfig)}`);
  }
};

testSuite.description = 'Creating a Plugin';

export default testSuite;
