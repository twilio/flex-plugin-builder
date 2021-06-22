/* eslint-disable */
import { replaceInFile } from 'replace-in-file';
import { TestSuite, TestParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion } from '../utils';

const PLUGIN_START_TIMEOUT = 30000;
const PLUGIN_START_POLL_INTERVAL = 1000;

// Plugin start
const testSuite: TestSuite = async ({ scenario, config, secrets }: TestParams): Promise<void> => {
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  const tmpComponentText = 'hot reload works';
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start'], { detached: true, cwd: scenario.plugin.dir });
  await pluginHelper.waitForPluginToStart(scenario.plugin.localhostUrl, PLUGIN_START_TIMEOUT, PLUGIN_START_POLL_INTERVAL);
  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create();

  try {
    // Plugin loads
    await Browser.loginViaConsole(cookies, config.consoleBaseUrl, scenario.plugin.localhostUrl, 'agent-desktop');
    await assertion.browser.userIsOnView('Agent Desktop');
    await assertion.browser.pluginIsVisible(scenario.plugin.componentText);

    // Verify hot reload
    await replaceInFile({
      files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: scenario.plugin.componentText,
      to: tmpComponentText,
    });

    await assertion.browser.pluginIsVisible(tmpComponentText);
  } finally {
    await Browser.kill();
    twilioCliResult.child?.kill();
  }

  await replaceInFile({
    files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: tmpComponentText,
    to: scenario.plugin.componentText,
  });
};
testSuite.description = 'Running {{twilio flex:plugins:start}}';

export default testSuite;
