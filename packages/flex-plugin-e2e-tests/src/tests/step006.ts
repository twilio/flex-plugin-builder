/* eslint-disable */
import { replaceInFile } from 'replace-in-file';
import { TestSuite, TestParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion, killChildProcess } from '../utils';

const PLUGIN_START_TIMEOUT = 30000;
const PLUGIN_START_POLL_INTERVAL = 1000;

// Plugin start
const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  const tmpComponentText = 'hot reload works';
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start'], { detached: true, cwd: scenario.plugins[0].dir });
  await pluginHelper.waitForPluginToStart(scenario.plugins[0].localhostUrl, PLUGIN_START_TIMEOUT, PLUGIN_START_POLL_INTERVAL);
  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create({ flex: scenario.plugins[0].localhostUrl, twilioConsole: config.consoleBaseUrl });

  try {
    // Plugin loads
    await Browser.app.twilioConsole.login(cookies, 'agent-desktop', secrets.api.accountSid, config.localhostPort);
    await assertion.app.view.agentDesktop.isVisible();
    await assertion.app.view.plugins.plugin.isVisible(scenario.plugins[0].componentText);

    // Verify hot reload
    await replaceInFile({
      files: joinPath(scenario.plugins[0].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: scenario.plugins[0].componentText,
      to: tmpComponentText,
    });

    await assertion.app.view.plugins.plugin.isVisible(tmpComponentText);
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
    await killChildProcess(twilioCliResult.child, environment.operatingSystem)
  }

  await replaceInFile({
    files: joinPath(scenario.plugins[0].dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: tmpComponentText,
    to: scenario.plugins[0].componentText,
  });
};
testSuite.description = 'Running {{twilio flex:plugins:start}}';

export default testSuite;
