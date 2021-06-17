/* eslint-disable */
import { TestSuite, TestParams } from '../core';
import { api, assertion, Browser, ConsoleAPI, pluginHelper } from '../utils';

const PLUGIN_RELEASED_TIMEOUT = 30000;
const PLUGIN_RELEASED_POLL_INTERVAL = 5000;

// Plugin visible on the Hosted Flex
const testSuite: TestSuite = async ({ scenario, config, secrets }: TestParams): Promise<void> => {
  if(!scenario.plugin.newlineValue) {
    throw new Error(`scenario.plugin.newlineValue does not have a valid value`);
  }

  // Fetch and find latest released plugin
  const release = await api.getActiveRelease();
  const plugins = await api.getActivePlugins(release!.configuration_sid);
  const releasedPlugin = plugins.plugins.find(plugin => plugin.unique_name == scenario.plugin.name);
  if(!releasedPlugin) {
    throw new Error(`Did not find plugin with name: ${scenario.plugin.name} in released plugins`);
  }

  const consoleApi = new ConsoleAPI(config.consoleBaseUrl, secrets.console);
  const cookies = await consoleApi.getCookies();

  await Browser.create();
  try {
    // Log into Flex
    await Browser.loginViaConsole(cookies, config.consoleBaseUrl, config.hostedFlexBaseUrl, 'admin');
    await assertion.browser.userIsOnView('Admin Dashboard');

    // Make sure that /plugins contain the plugin
    await pluginHelper.waitForPluginToRelease(config.hostedFlexBaseUrl, releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL);
    await Browser.navigate(config.hostedFlexBaseUrl, 'agent-desktop');

    await assertion.browser.pluginIsVisible(scenario.plugin.newlineValue);
  } finally {
    await Browser.kill();
  }
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';

export default testSuite;
