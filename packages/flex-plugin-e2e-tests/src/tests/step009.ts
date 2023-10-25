/* eslint-disable import/no-unused-modules */
import { TestSuite, TestParams } from '../core';
import { api, assertion, Browser, ConsoleAPI, pluginHelper } from '../utils';
import { logger } from '@twilio/flex-dev-utils';

const PLUGIN_RELEASED_TIMEOUT = 30000;
const PLUGIN_RELEASED_POLL_INTERVAL = 5000;

// Plugin visible on the Hosted Flex
const testSuite: TestSuite = async ({ scenario, config, secrets, environment }: TestParams): Promise<void> => {
  const plugin = scenario.plugins[0];
  assertion.not.isNull(plugin);

  if (!plugin.newlineValue) {
    throw new Error(`scenario.plugin.newlineValue does not have a valid value`);
  }

  // Fetch and find latest released plugin
  const release = await api.getActiveRelease();

  if (!release) {
    throw new Error('Account does not have an active release');
  }

  const plugins = await api.getActivePlugins(release.configuration_sid);
  const releasedPlugin = plugins.plugins.find((plgin) => plgin.unique_name === plugin.name);
  if (!releasedPlugin) {
    throw new Error(`Did not find plugin with name: ${plugin.name} in released plugins`);
  }

  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();

  await Browser.create({ flex: config.hostedFlexBaseUrl, twilioConsole: config.consoleBaseUrl });
  try {
    // Log into Flex
    await Browser.app.twilioConsole.login(cookies, 'admin', secrets.api.accountSid, config.localhostPort);

    await assertion.app.view.adminDashboard.isVisible();

    // Verify that user is on the right account
    const accountSid = await Browser.app.getFlexAccountSid();
    assertion.equal(accountSid, secrets.api.accountSid);

    // Make sure that /plugins contain the plugin
    logger.info("Waiting for plugins to release.")
    await pluginHelper.waitForPluginToRelease(releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL);
    logger.info("Release completes, verifying plugin on UI.")
    await Browser.app.agentDesktop.open();
  

    await assertion.app.view.plugins.plugin.isVisible(plugin.newlineValue);
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
  }
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';

export default testSuite;
