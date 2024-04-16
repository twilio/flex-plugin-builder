/* eslint-disable */
import { replaceInFile } from 'replace-in-file';
import { TestSuite, TestParams, testParams } from '../core';
import { spawn, Browser, pluginHelper, joinPath, assertion, killChildProcess, ConsoleAPI } from '../utils';

// Plugin start
const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  const ext = scenario.isTS ? 'tsx' : 'jsx';
  const tmpComponentText = 'hot reload works';
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start', '-l', 'debug'], { detached: true, cwd: plugin.dir });
  await pluginHelper.waitForPluginToStart(
    plugin.localhostUrl,
    testParams.config.start.timeout,
    testParams.config.start.pollInterval,
  );
  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create({ flex: plugin.localhostUrl, twilioConsole: config.consoleBaseUrl });

  try {
    // Plugin loads
    await Browser.app.twilioConsole.login(cookies, 'agent-desktop', secrets.api.accountSid, config.localhostPort);
    await assertion.app.view.agentDesktop.isVisible();
    await assertion.app.view.plugins.plugin.isVisible(plugin.componentText);

    // Verify hot reload
    await replaceInFile({
      files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: plugin.componentText,
      to: tmpComponentText,
    });

    await assertion.app.view.plugins.plugin.isVisible(tmpComponentText);
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
    await killChildProcess(twilioCliResult.child, environment.operatingSystem);
  }

  await replaceInFile({
    files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
    from: tmpComponentText,
    to: plugin.componentText,
  });
};
testSuite.description = 'Running {{twilio flex:plugins:start}}';

export default testSuite;
