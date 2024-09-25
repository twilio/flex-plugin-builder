/* eslint-disable import/no-unused-modules */
import { logger } from '@twilio/flex-dev-utils';

import { TestSuite, TestParams } from '../core';
import { api, assertion, Browser, pluginHelper } from '../utils';

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
  try {
    // Log into Flex
    await Browser.app.twilioConsole.login('admin', secrets.api.accountSid, config.localhostPort);

    await assertion.app.view.adminDashboard.isVisible();

    // Verify that user is on the right account
    const accountSid = await Browser.app.getFlexAccountSid();
    assertion.equal(accountSid, secrets.api.accountSid);

    const assertRetry = async () => {
      const maxRetries = 2;
      let attempts = 0;
      let success = false;

      while (attempts <= maxRetries && !success) {
        try {
          await Browser.app.agentDesktop.open();
          logger.info('Agent Desktop opened');

          // Check if the element is visible
          await assertion.app.view.plugins.plugin.isVisible(plugin.newlineValue!);
          success = true; // If no error, mark success
        } catch (error) {
          attempts += 1;
          if (attempts > maxRetries) {
            if (error instanceof Error) {
              logger.error(`Failed to open Agent Desktop after ${attempts} attempts: ${error.message}`);
            } else {
              logger.error(`Failed to open Agent Desktop after ${attempts} attempts: ${String(error)}`);
            }
            throw new Error(`Failed to open Agent Desktop after ${attempts} attempts`);
          } else {
            logger.info(`Attempt ${attempts} failed. Retrying...`);
          }
        }
      }
    };
    // Make sure that /plugins contain the plugin
    await pluginHelper.waitForPluginToRelease(releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL);
    await assertRetry();
  } catch (e) {
    await Browser.app.takeScreenshot(environment.cwd);
    throw e;
  } finally {
    await Browser.kill();
  }
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';

export default testSuite;
