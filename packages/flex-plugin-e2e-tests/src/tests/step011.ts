/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams, testParams } from '../core';
import { spawn, Browser, pluginHelper, assertion, killChildProcess, retryOnError } from '../utils';

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
  await Browser.create({ flex: plugin3.localhostUrl, twilioConsole: config.consoleBaseUrl });

  const loginAndAssert = async (firstLoad: boolean) => {
    // Load local plugin

    await Browser.app.twilioConsole.login('agent-desktop', secrets.api.accountSid, config.localhostPort, firstLoad);

    // Check if local plugin loaded okay
    await assertion.app.view.agentDesktop.isVisible();

    // @ts-ignore
    await assertion.app.view.plugins.plugin.isVisible(plugin1.newlineValue);
    await assertion.app.view.plugins.plugin.isVisible(plugin2.componentText);
    await assertion.app.view.plugins.plugin.isVisible(plugin3.componentText);
  };

  const onError = async (e: any) => {
    await Browser.app.takeScreenshot(environment.cwd);
  };

  const onFinally = async () => {
    await Browser.kill();
    await killChildProcess(twilioCliResult.child, environment.operatingSystem);
  };

  await retryOnError(loginAndAssert, onError, onFinally, 3);
};
testSuite.description = 'Running {{twilio flex:plugins:start}} with multiple plugins: 2 local and 1 remote';

export default testSuite;
