/* eslint-disable import/no-unused-modules, sonarjs/no-duplicate-string */
import { TestSuite, TestParams } from '../core';
import { spawn, logResult, assertion, joinPath, writeFileSync } from '../utils';

// Create a plugin
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const flags: string[] = [];
  if (scenario.isTS) {
    flags.push('--typescript');
  }
  const twilioCliResult = await spawn('twilio', ['flex:plugins:create', scenario.plugins[0].name, ...flags]);
  logResult(twilioCliResult);

  // Assert files/directories exist
  assertion.fileExists([scenario.plugins[0].dir], 'Plugin directory does not exist');
  assertion.fileExists([scenario.plugins[0].dir, 'src']);
  assertion.fileExists([scenario.plugins[0].dir, 'src', 'components']);
  assertion.fileExists([scenario.plugins[0].dir, 'src', 'components', '__tests__']);
  assertion.not.dirIsEmpty([scenario.plugins[0].dir, 'src', 'components', '__tests__']);
  assertion.fileExists([scenario.plugins[0].dir, 'public']);
  assertion.fileExists([scenario.plugins[0].dir, 'package.json']);
  assertion.fileExists([scenario.plugins[0].dir, 'webpack.config.js']);
  assertion.fileExists([scenario.plugins[0].dir, 'webpack.dev.js']);
  assertion.fileExists([scenario.plugins[0].dir, 'jest.config.js']);
  assertion.fileExists([scenario.plugins[0].dir, 'public', 'appConfig.js']);
  assertion.fileExists([scenario.plugins[0].dir, 'public', 'appConfig.example.js']);

  // Assert package.json
  assertion.jsonFileContains(
    [scenario.plugins[0].dir, 'package.json'],
    "dependencies['flex-plugin-scripts']",
    scenario.packageVersion,
  );
  assertion.jsonFileContains([scenario.plugins[0].dir, 'package.json'], "dependencies['react']", `16.5.2`);
  assertion.jsonFileContains([scenario.plugins[0].dir, 'package.json'], "dependencies['react-dom']", `16.5.2`);
  assertion.jsonFileContains(
    [scenario.plugins[0].dir, 'package.json'],
    "devDependencies['react-test-renderer']",
    `16.5.2`,
  );

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

    writeFileSync(
      joinPath(scenario.plugins[0].dir, 'public', 'appConfig.js'),
      `var appConfig = ${JSON.stringify(appConfig)}`,
    );
  }
};

testSuite.description = 'Creating a Plugin';

export default testSuite;
