/* eslint-disable import/no-unused-modules */
import { logger } from '@twilio/flex-dev-utils';
import { TestSuite, TestParams } from '../core';
import { api, assertion, Browser, ConsoleAPI, pluginHelper, sleep } from '../utils';

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
    await Browser.app.twilioConsole.login(cookies, 'agent-desktop', secrets.api.accountSid, config.localhostPort);

    await assertion.app.view.agentDesktop.isVisible();

    // Verify that user is on the right account
    const accountSid = await Browser.app.getFlexAccountSid();
    assertion.equal(accountSid, secrets.api.accountSid);

    // Make sure that /plugins contain the plugin
    await pluginHelper.waitForPluginToRelease(releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL);
    logger.info('Release check completed, going to Agent Desktop');

    await Browser.app.agentDesktop.open();

    logger.info('Going to sleep');
    await sleep(5000);

    logger.info('Checking if Agent desktop is open');
    await assertion.app.view.agentDesktop.isVisible();
    logger.info(`Agent Desktop is open, verifying asertions for newline having value: ${plugin.newlineValue}`);
    await assertion.app.view.plugins.plugin.isVisible(plugin.newlineValue);
    logger.info('All assertions complete!');
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
  }
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';

export default testSuite;
