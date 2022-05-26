/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams, testParams, PluginType } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion, killChildProcess } from '../utils';

// Starting multiple plugins using 2 local and one remote works
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
  const flags: string[] = [];
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  const startPlugin = async (url: string) =>
    pluginHelper.waitForPluginToStart(url, testParams.config.start.timeout, testParams.config.start.pollInterval);

  if (scenario.isTS) {
    flags.push('--typescript');
  }

  // Create and setup a new plugin
  const setup = async (plugin: PluginType) => {
    await spawn('twilio', ['flex:plugins:create', plugin.name, ...flags]);
    pluginHelper.changeFlexUIVersionIfRequired(scenario, plugin);
    await spawn('npm', ['i'], { cwd: plugin.dir });

    await replaceInFile({
      files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: /This is a dismissible demo component.*/,
      to: plugin.componentText,
    });
  };

  // Set up two new plugins
  await Promise.all([setup(plugin2), setup(plugin3)]);

  // Start all 3 plugins (Note: cwd is plugin3 in this scenario since plugin is the remote one)
  const twilioCliResult = await spawn(
    'twilio',
    ['flex:plugins:start', '--name', `${plugin1.name}@remote`, '--name', plugin2.name],
    { detached: true, cwd: plugin3.dir },
  );
  await Promise.all([startPlugin(plugin2.localhostUrl), startPlugin(plugin3.localhostUrl)]);

  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create({ flex: plugin3.localhostUrl, twilioConsole: config.consoleBaseUrl });

  try {
    // Plugin loads
    await Browser.app.twilioConsole.login(cookies, 'admin', secrets.api.accountSid, config.localhostPort);
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
testSuite.description = 'Running {{twilio flex:plugins:start}} with multiple plugins: 2 local and 1 remote';

export default testSuite;
