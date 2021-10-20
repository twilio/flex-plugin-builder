/* eslint-disable import/no-unused-modules */
import { replaceInFile } from 'replace-in-file';
import semver from 'semver';

import { TestSuite, TestParams } from '../core';
import { spawn, Browser, pluginHelper, ConsoleAPI, joinPath, assertion, killChildProcess, api } from '../utils';

// should import these from other files
const PLUGIN_START_TIMEOUT = 30000;
const PLUGIN_START_POLL_INTERVAL = 1000;

const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  if (!scenario.isMultiPluginRemote && !scenario.isMultiPluginVersioned) {
    return;
  }

  if (!scenario.plugin.newlineValue) {
    throw new Error(`scenario.plugin.newlineValue does not have a valid value`);
  }

  const flags: string[] = [];
  const ext = scenario.isTS ? 'tsx' : 'jsx';
  const tmpComponentText = 'This is the new text for the next version!';

  // Add the remote plugin & local plugin
  if (scenario.isMultiPluginRemote) {
    flags.push('--name', `${scenario.plugin.name}@remote`, '--name', scenario.plugin2.name);
  }

  // Edit and then deploy the remote plugin to create a new version
  else if (scenario.isMultiPluginVersioned) {
    // Edit remote plugin to have different text
    await replaceInFile({
      files: joinPath(scenario.plugin.dir, 'src', 'components', 'CustomTaskList', `CustomTaskList.${ext}`),
      from: scenario.plugin.componentText,
      to: tmpComponentText,
    });

    // Deploy the edited plugin
    const resource = await api.getLatestPluginVersion(scenario.plugin.name);
    const oldVersion = resource?.version || '0.0.0';
    scenario.plugin.version = semver.inc(oldVersion, 'patch') as string;
    await spawn(
      'twilio',
      ['flex:plugins:deploy', '--changelog', `"${scenario.plugin.changelog}"`, '--patch', ...config.regionFlag],
      {
        cwd: scenario.plugin.dir,
      },
    );

    // Release the edited plugin
    await spawn('twilio', [
      'flex:plugins:release',
      '--plugin',
      `${scenario.plugin.name}@${scenario.plugin.version}`,
      ...config.regionFlag,
    ]);

    // Add the old version of plugin to flags along with another local plugin
    flags.push('--name', `${scenario.plugin.name}@${oldVersion}`, '--name', scenario.plugin2.name);
  }

  // Start all 3 plugins (Note: cwd is plugin3 in this scenario since plugin is the remote one)
  const twilioCliResult = await spawn('twilio', ['flex:plugins:start', ...flags], {
    detached: true,
    cwd: scenario.plugin3.dir,
  });
  await pluginHelper.waitForPluginToStart(
    scenario.plugin2.localhostUrl,
    PLUGIN_START_TIMEOUT,
    PLUGIN_START_POLL_INTERVAL,
  );
  await pluginHelper.waitForPluginToStart(
    scenario.plugin3.localhostUrl,
    PLUGIN_START_TIMEOUT,
    PLUGIN_START_POLL_INTERVAL,
  );
  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();
  await Browser.create({ flex: scenario.plugin3.localhostUrl, twilioConsole: config.consoleBaseUrl });

  try {
    // Plugin loads
    await Browser.app.twilioConsole.login(cookies, 'admin', secrets.api.accountSid, config.localhostPort);
    await assertion.app.view.agentDesktop.isVisible();

    await assertion.app.view.plugins.plugin.isVisible(scenario.plugin.newlineValue);
    await assertion.app.view.plugins.plugin.isVisible(scenario.plugin2.componentText);
    await assertion.app.view.plugins.plugin.isVisible(scenario.plugin3.componentText);
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
    await killChildProcess(twilioCliResult.child, environment.operatingSystem);
  }
};
testSuite.description = 'Running {{twilio flex:plugins:start}} with multiple plugins';

export default testSuite;
