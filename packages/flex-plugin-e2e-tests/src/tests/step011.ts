/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams, testParams } from '../core';
import { spawn, Browser, pluginHelper, assertion, killChildProcess } from '../utils';

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

  const startPlugin = async (url: string) =>
    pluginHelper.waitForPluginToStart(url, testParams.config.start.timeout, testParams.config.start.pollInterval);

  // Start all 3 plugins (Note: cwd is plugin3 in this scenario since plugin is the remote one)
  const twilioCliResult = await spawn(
    'twilio',
    ['flex:plugins:start', '--name', `${plugin1.name}@${plugin1.version}`, '--name', plugin2.name],
    { detached: true, cwd: plugin3.dir },
  );
  await Promise.all([startPlugin(plugin2.localhostUrl), startPlugin(plugin3.localhostUrl)]);

  try {
    // Load local plugin
    await Browser.create({ flex: plugin3.localhostUrl, twilioConsole: config.consoleBaseUrl });
    await Browser.app.twilioConsole.login('admin', secrets.api.accountSid, config.localhostPort);

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
testSuite.description = 'Running {{twilio flex:plugins:start}} with multiple plugins: 2 local and 1 remote';

export default testSuite;
