/* eslint-disable import/no-unused-modules */
import { logger } from '@twilio/flex-dev-utils';

import { TestSuite, TestParams } from '../core';
import { api, assertion, Browser, pluginHelper, retryOnError } from '../utils';

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

  await Browser.create({ flex: config.hostedFlexBaseUrl, twilioConsole: config.consoleBaseUrl });
  // Log into Flex
  await Browser.app.twilioConsole.login('admin', secrets.api.accountSid, config.localhostPort);

  await assertion.app.view.adminDashboard.isVisible();

  // Verify that user is on the right account
  const accountSid = await Browser.app.getFlexAccountSid();
  assertion.equal(accountSid, secrets.api.accountSid);
  // Make sure that /plugins contain the plugin
  await pluginHelper.waitForPluginToRelease(releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL);
  // await assertRetry();

  const loginAndAssert = async () => {
    // Load local plugin

    await Browser.app.agentDesktop.open();
    logger.info('Agent Desktop opened');

    // Check if the element is visible
    await assertion.app.view.plugins.plugin.isVisible(plugin.newlineValue!);
  };

  const onError = async (e: any) => {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  };

  const onFinally = async () => {
    await Browser.kill();
  };

  await retryOnError(loginAndAssert, onError, onFinally, 3);
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';

export default testSuite;
