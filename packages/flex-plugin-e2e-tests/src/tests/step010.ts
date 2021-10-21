/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion, killChildProcess, logResult } from '../utils';

// should import these from other files
const PLUGIN_START_TIMEOUT = 30000;
const PLUGIN_START_POLL_INTERVAL = 1000;

const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  const flags: string[] = [];
  const ext = scenario.isTS ? 'tsx' : 'jsx';

  if (scenario.isTS) {
    flags.push('--typescript');
  }
  // Create 2 new plugins
  const twilioCliResult2 = await spawn('twilio', ['flex:plugins:create', scenario.plugins[1].name, ...flags]);
  logResult(twilioCliResult2);

  const twilioCliResult3 = await spawn('twilio', ['flex:plugins:create', scenario.plugins[2].name, ...flags]);
  logResult(twilioCliResult3);

  // Install dependencies in the 2 new plugins
  const result2 = await spawn('npm', ['i'], { cwd: scenario.plugins[1].dir });
  logResult(result2);

  const result3 = await spawn('npm', ['i'], { cwd: scenario.plugins[2].dir });
  logResult(result3);

  // Replace component text in the 2 new plugins
  await replaceInFile({
    files: joinPath(scenario.plugins[1].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugins[1].componentText,
  });

  await replaceInFile({
    files: joinPath(scenario.plugins[2].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: /This is a dismissible demo component.*/,
    to: scenario.plugins[2].componentText,
  });

  const startFlags: string[] = [];

  if (!scenario.plugins[0].newlineValue) {
    throw new Error(`scenario.plugin.newlineValue does not have a valid value`);
  }

  // Add the remote plugin & local plugin
  startFlags.push('--name', `${scenario.plugins[0].name}@remote`, '--name', scenario.plugins[1].name);

  // Start all 3 plugins (Note: cwd is plugin3 in this scenario since plugin is the remote one)
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start', ...startFlags], {
    detached: true,
    cwd: scenario.plugins[2].dir,
  });
  await pluginHelper.waitForPluginToStart(
    scenario.plugins[1].localhostUrl,
    PLUGIN_START_TIMEOUT,
    PLUGIN_START_POLL_INTERVAL,
  );
  await pluginHelper.waitForPluginToStart(
    scenario.plugins[2].localhostUrl,
    PLUGIN_START_TIMEOUT,
    PLUGIN_START_POLL_INTERVAL,
  );
  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create({ flex: scenario.plugins[2].localhostUrl, twilioConsole: config.consoleBaseUrl });

  try {
    // Plugin loads
    await Browser.app.twilioConsole.login(cookies, 'admin', secrets.api.accountSid, config.localhostPort);
    await assertion.app.view.agentDesktop.isVisible();

    await assertion.app.view.plugins.plugin.isVisible(scenario.plugins[0].newlineValue);
    await assertion.app.view.plugins.plugin.isVisible(scenario.plugins[1].componentText);
    await assertion.app.view.plugins.plugin.isVisible(scenario.plugins[2].componentText);
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
    await killChildProcess(twilioCliResult.child, environment.operatingSystem);
  }
};
testSuite.description = 'Running {{twilio flex:plugins:start}} with multiple plugins: 2 local and 1 remote';

export default testSuite;
