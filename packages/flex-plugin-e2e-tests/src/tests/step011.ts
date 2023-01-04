/* eslint-disable import/no-unused-modules */
import semver from 'semver';

import { TestSuite, TestParams, testParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, api, assertion, killChildProcess } from '../utils';
import { setupFlexBeforeLocalhost } from './step010';

// Starting multiple plugins using --include-remote works
const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  const plugin1 = scenario.plugins[0];
  const plugin2 = scenario.plugins[1];
  const plugin3 = scenario.plugins[2];
  assertion.not.isNull(plugin1);
  assertion.not.isNull(plugin2);
  assertion.not.isNull(plugin3);

  if (!plugin1.newlineValue) {
    throw new Error('scenario.plugin.newlineValue does not have a valid value');
  }

  // Deploy plugin2
  const resource = await api.getLatestPluginVersion(plugin2.name);
  const oldVersion = resource?.version || '0.0.0';
  plugin2.changelog = `e2e test ${Date.now()}`;
  plugin2.version = semver.inc(oldVersion, 'patch') as string;
  await spawn(
    'twilio',
    ['flex:plugins:deploy', '--changelog', `"${plugin2.changelog}"`, '--patch', '-l', 'debug', ...config.regionFlag],
    {
      cwd: plugin2.dir,
    },
  );

  // Release plugin2
  await spawn('twilio', [
    'flex:plugins:release',
    '--plugin',
    `${plugin2.name}@${plugin2.version}`,
    '-l',
    'debug',
    ...config.regionFlag,
  ]);

  // Start 1 local plugin and all remote plugins (note: local is plugin3 by cwd)
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start --include-remote'], {
    detached: true,
    cwd: plugin3.dir,
  });
  await pluginHelper.waitForPluginToStart(
    plugin3.localhostUrl,
    testParams.config.start.timeout,
    testParams.config.start.pollInterval,
  );

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
testSuite.description =
  'Running {{twilio flex:plugins:start --include-remote}} with 1 local plugin and all remote plugins';

export default testSuite;
