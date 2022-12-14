/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import semver from 'semver';

import { TestSuite, TestParams, testParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion, killChildProcess, api } from '../utils';
import { setupFlexBeforeLocalhost } from './step010';

const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  const tmpComponentText = 'This is the new text for the next version!';
  const startPlugin = async (url: string) =>
    pluginHelper.waitForPluginToStart(url, testParams.config.start.timeout, testParams.config.start.pollInterval);
  const plugin1 = scenario.plugins[0];
  const plugin2 = scenario.plugins[1];
  const plugin3 = scenario.plugins[2];
  assertion.not.isNull(plugin1);
  assertion.not.isNull(plugin2);
  assertion.not.isNull(plugin3);
  assertion.not.isNull(plugin1.newlineValue, 'scenario.plugins[0].newlineValue does not have a valid value');

  // Edit remote plugin to have different text
  await replaceInFile({
    files: joinPath(plugin1.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: plugin1.componentText,
    to: tmpComponentText,
  });

  // Deploy the edited plugin
  const resource = await api.getLatestPluginVersion(plugin1.name);
  const oldVersion = resource?.version || '0.0.0';
  plugin1.version = semver.inc(oldVersion, 'patch') as string;
  await spawn(
    'twilio',
    ['flex:plugins:deploy', '--changelog', `"${plugin1.changelog}"`, '--patch', '-l', 'debug', ...config.regionFlag],
    {
      cwd: plugin1.dir,
    },
  );

  // Release the edited plugin
  await spawn('twilio', [
    'flex:plugins:release',
    '--plugin',
    '-l',
    'debug',
    `${plugin1.name}@${plugin1.version}`,
    ...config.regionFlag,
  ]);

  // Start the 2 local plugins and 1 versioned plugin (Note: cwd is plugin3 in this scenario since plugin is the remote one)
  const flags = ['--name', `${plugin1.name}@${oldVersion}`, '--name', plugin2.name];
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start', '-l', 'debug', ...flags], {
    detached: true,
    cwd: plugin3.dir,
  });
  await Promise.all([startPlugin(plugin2.localhostUrl), startPlugin(plugin3.localhostUrl)]);
  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();

  try {
    // Login to Flex and setup the required flex.twilio.com cookies
    await setupFlexBeforeLocalhost(config, secrets, cookies);

    // Load local plugin
    await Browser.loadNewPage({ flex: plugin3.localhostUrl, twilioConsole: config.consoleBaseUrl });
    await Browser.app.twilioConsole.login(cookies, 'admin', secrets.api.accountSid, config.localhostPort, false);

    // Check if local plugin loaded okay
    await assertion.app.view.agentDesktop.isVisible();

    // @ts-ignore
    await assertion.app.view.plugins.plugin.isVisible(plugin1.newlineValue);
    await assertion.app.view.plugins.plugin.isVisible(plugin2.componentText);
    await assertion.app.view.plugins.plugin.isVisible(plugin3.componentText);
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
    await killChildProcess(twilioCliResult.child, environment.operatingSystem);
  }
};

testSuite.description = 'Running {{twilio flex:plugins:start}} with multiple plugins: 2 local and 1 versioned';

export default testSuite;
