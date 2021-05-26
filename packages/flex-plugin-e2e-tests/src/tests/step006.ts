/* eslint-disable */
import { replaceInFile } from 'replace-in-file';
import { TestSuite, TestParams } from '..';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion } from '../utils';

const PLUGIN_START_TIMEOUT = 30000;
const PLUGIN_START_POLL_INTERVAL = 1000;

// Plugin start
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {
  const tmpComponentText = 'hot reload works';
  const twilioCliResult = await spawn(`${joinPath(params.homeDir, 'twilio')}`, ['flex:plugins:start'], { detached: true, cwd: params.plugin.dir, shell: true });
  await pluginHelper.waitForPluginToStart(params.plugin.baseUrl, PLUGIN_START_TIMEOUT, PLUGIN_START_POLL_INTERVAL);
  const consoleApi = new ConsoleAPI(params.consoleBaseUrl, params.secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create();

  try {
    // Plugin loads
    await Browser.loginViaConsole(cookies, params.consoleBaseUrl, params.plugin.baseUrl);
    await assertion.browser.userIsOnView('Agent Desktop');
    await assertion.browser.pluginIsVisible(params.plugin.componentText);

    // Verify hot reload
    await replaceInFile({
      files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
      from: params.plugin.componentText,
      to: tmpComponentText,
    }); 

    await assertion.browser.pluginIsVisible(tmpComponentText);
  } finally {
    await Browser.kill();
    twilioCliResult.child?.kill();
  }

  await replaceInFile({
    files: joinPath(params.plugin.dir, 'src', 'components', 'CustomTaskList', 'CustomTaskList.jsx'),
    from: tmpComponentText,
    to: params.plugin.componentText,
  });
};
testSuite.description = 'Running {{twilio flex:plugins:start}}';

export default testSuite;
