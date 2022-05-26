import axios from 'axios';
import { ConfiguredPluginResource } from '@twilio/flex-plugins-api-client';
import { logger } from '@twilio/flex-dev-utils';
import { readPackageJson, writeJSONFile } from '@twilio/flex-dev-utils/dist/fs';

import { Browser } from './browser';
import { sleep } from './timers';
import { TestScenario, PluginType } from '../core';
import { joinPath } from '.';

/**
 * Waits for plugin to start at the given url
 * @param url plugin url to poll for a successful response
 * @param timeout maximum amount of time to wait until failing
 * @param pollInterval time to wait between each polling attempt
 */
const waitForPluginToStart = async (url: string, timeout: number, pollInterval: number): Promise<void> => {
  let counter = 0;

  while (true) {
    try {
      await axios.get(url);
      break;
    } catch (e) {
      if (counter === timeout) {
        logger.error(e);
        throw new Error('Plugin did not start');
      }
    }

    await sleep(pollInterval);
    counter += pollInterval;
  }
};

/**
 * Waits for /plugins to contain the released plugin
 * @param flexBaseUrl Flex base URL
 * @param releasedPlugin plugin which was released
 * @param timeout maximum amount of time to wait until failing
 * @param pollInterval time to wait between each polling attempt
 */
const waitForPluginToRelease = async (
  releasedPlugin: ConfiguredPluginResource,
  timeout: number,
  pollInterval: number,
): Promise<void> => {
  let counter = 0;

  while (true) {
    try {
      const plugins = await Browser.app.plugins.list();
      const plugin = plugins.find((plugin) => plugin.name === releasedPlugin.unique_name);

      if (!plugin) {
        throw new Error(`/plugins did not contain ${releasedPlugin.unique_name}`);
      }
      logger.info('/plugins endpoint returned', JSON.stringify(plugins));

      break;
    } catch (e) {
      if (counter >= timeout) {
        throw e;
      }
    }

    await sleep(pollInterval);
    counter += pollInterval;
  }
};

/**
 * Changes the @twilio/flex-ui version in package.json if required
 * @param scenario
 * @param plugin
 */
const changeFlexUIVersionIfRequired = (scenario: TestScenario, plugin: PluginType) => {
  if (scenario.flexUIVersion) {
    const pkgPath = joinPath(plugin.dir, 'package.json');
    const pkg = readPackageJson(pkgPath);
    pkg.devDependencies['@twilio/flex-ui'] = scenario.flexUIVersion;
    writeJSONFile(pkg, pkgPath);
  }
};

export default {
  waitForPluginToStart,
  waitForPluginToRelease,
  changeFlexUIVersionIfRequired,
};
