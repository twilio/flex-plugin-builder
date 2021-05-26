/* eslint-disable */
import { TestSuite, TestParams } from '..';
import { api, assertion, Browser, ConsoleAPI, pluginHelper } from '../utils';

const PLUGIN_RELEASED_TIMEOUT = 30000;
const PLUGIN_RELEASED_POLL_INTERVAL = 5000;

// Plugin visible on the Hosted Flex
const testSuite: TestSuite = async (params: TestParams): Promise<void> => {  
  // Fetch and find latest released plugin  
  const release = await api.getActiveRelease();
  const plugins = await api.getActivePlugins(release!.configuration_sid);

  const releasedPlugin = plugins.plugins.find(plugin => plugin.unique_name == params.plugin.name);

  if(!releasedPlugin) {
    throw new Error(`Did not find plugin with name: ${params.plugin.name} in released plugins`);
  }   

  const consoleApi = new ConsoleAPI(params.consoleBaseUrl, params.secrets.console);
  const cookies = await consoleApi.getCookies();
  
  await Browser.create();

  try {
    // Log into Flex
    await Browser.loginViaConsole(cookies, params.consoleBaseUrl, params.hostedFlexBaseUrl, 'admin');
    await assertion.browser.userIsOnView('Admin Dashboard');

    // Make sure that /plugins contain the plugin
    await pluginHelper.waitForPluginToRelease(params.hostedFlexBaseUrl, releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL);

    await Browser.navigate(params.hostedFlexBaseUrl, 'agent-desktop');

    if(!params.plugin.newlineValue) {
        throw new Error(`params.plugin.newlineValue does not have a valid value`);
    }

    await assertion.browser.pluginIsVisible(params.plugin.newlineValue);

  } finally {
    await Browser.kill();
  }
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';

export default testSuite;
