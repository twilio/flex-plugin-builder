/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';

import { TestSuite, TestParams, testParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion, killChildProcess, logResult } from '../utils';
import { PluginType } from '../core/parameters';

const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  if (!scenario.plugins[0].newlineValue) {
    throw new Error('scenario.plugin.newlineValue does not have a valid value');
  }
  const flags: string[] = [];
  const ext = scenario.isTS ? 'tsx' : 'jsx';

  if (scenario.isTS) {
    flags.push('--typescript');
  }

  const setup = async (plugin: PluginType) => {
    const createResult = await spawn('twilio', ['flex:plugins:create', plugin.name, ...flags]);
    logResult(createResult);

    const installResult = await spawn('npm', ['i'], { cwd: plugin.dir });
    logResult(installResult);

    await replaceInFile({
      files: joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: /This is a dismissible demo component.*/,
      to: plugin.componentText,
    });
  };

  await Promise.all([setup(scenario.plugins[1]), setup(scenario.plugins[2])]);

  const startFlags: string[] = [];

  // Add the remote plugin & local plugin
  startFlags.push('--name', `${scenario.plugins[0].name}@remote`, '--name', scenario.plugins[1].name);

  // Start all 3 plugins (Note: cwd is plugin3 in this scenario since plugin is the remote one)
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start', ...startFlags], {
    detached: true,
    cwd: scenario.plugins[2].dir,
  });
  await pluginHelper.waitForPluginToStart(
    scenario.plugins[1].localhostUrl,
    testParams.config.start.timeout,
    testParams.config.start.pollInterval,
  );
  await pluginHelper.waitForPluginToStart(
    scenario.plugins[2].localhostUrl,
    testParams.config.start.timeout,
    testParams.config.start.pollInterval,
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
