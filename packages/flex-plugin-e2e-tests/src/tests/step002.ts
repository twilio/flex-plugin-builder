/* eslint-disable import/no-unused-modules, sonarjs/no-duplicate-string */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams, PluginType } from '../core';
import { spawn, assertion, joinPath, writeFileSync, pluginHelper } from '../utils';

// Create plugins
const testSuite: TestSuite = async ({ scenario, config }: TestParams): Promise<void> => {
  const flags: string[] = [];
  if (scenario.isTS) {
    flags.push('--typescript');
  }
  const ext = scenario.isTS ? 'tsx' : 'jsx';

  const plugin1 = scenario.plugins[0];
  const plugin2 = scenario.plugins[1];
  const plugin3 = scenario.plugins[2];

  const setup = async (plugin: PluginType, shouldReplace = true) => {
    await spawn('twilio', ['flex:plugins:create', plugin.name, ...flags]);
    pluginHelper.changeFlexUIVersionIfRequired(scenario, plugin);
    await spawn('npm', ['i'], { cwd: plugin.dir });

    if (shouldReplace) {
      await replaceInFile({
        files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
        from: /This is a dismissible demo component.*/,
        to: plugin.componentText,
      });
    }
  };

  assertion.not.isNull(plugin1);
  assertion.not.isNull(plugin2);
  assertion.not.isNull(plugin3);

  // Set 3 plugins
  await setup(plugin1, false);
  await setup(plugin2);
  await setup(plugin3);

  // Assert files/directories exist
  assertion.fileExists([plugin1.dir], 'Plugin directory does not exist');
  assertion.fileExists([plugin1.dir], 'Plugin directory does not exist');
  assertion.fileExists([plugin1.dir, 'src']);
  assertion.fileExists([plugin1.dir, 'src', 'components']);
  assertion.fileExists([plugin1.dir, 'src', 'components', '__tests__']);
  assertion.not.dirIsEmpty([plugin1.dir, 'src', 'components', '__tests__']);
  assertion.fileExists([plugin1.dir, 'public']);
  assertion.fileExists([plugin1.dir, 'package.json']);
  assertion.fileExists([plugin1.dir, 'webpack.config.js']);
  assertion.fileExists([plugin1.dir, 'webpack.dev.js']);
  assertion.fileExists([plugin1.dir, 'jest.config.js']);
  assertion.fileExists([plugin1.dir, 'public', 'appConfig.js']);
  assertion.fileExists([plugin1.dir, 'public', 'appConfig.example.js']);

  // Assert package.json
  assertion.jsonFileContains(
    [plugin1.dir, 'package.json'],
    "devDependencies['@twilio/flex-plugin-scripts']",
    scenario.packageVersion,
  );
  assertion.jsonFileContains([plugin1.dir, 'package.json'], "dependencies['react']", `17.0.2`);
  assertion.jsonFileContains([plugin1.dir, 'package.json'], "dependencies['react-dom']", `17.0.2`);
  assertion.jsonFileContains([plugin1.dir, 'package.json'], "devDependencies['react-test-renderer']", `17.0.2`);

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

    writeFileSync(joinPath(plugin1.dir, 'public', 'appConfig.js'), `var appConfig = ${JSON.stringify(appConfig)}`);
  }
};

testSuite.description = 'Creating a Plugin';

export default testSuite;
