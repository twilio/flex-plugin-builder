import axios from 'axios';
import { logger } from 'flex-plugins-utils-logger';

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

    // eslint-disable-next-line no-loop-func
    await new Promise((r) => setTimeout(r, pollInterval));
    counter += pollInterval;
  }
};

export default {
  waitForPluginToStart,
};
