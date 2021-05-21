import axios from 'axios';
import { logger } from 'flex-plugins-utils-logger';

/**
 * Waits for plugin to start at the given url
 * @param url plugin url to poll for a successful response
 */
const waitForPluginToStart = async (url: string): Promise<void> => {
  let counter = 0;
  setInterval(async () => {
    if (counter >= 3) {
      throw new Error('Plugin did not start');
    }

    try {
      await axios.get(url);
      clearInterval(counter);
    } catch (e) {
      logger.warning(e);
    }
    counter += 1;
  }, 1000);
};

export default {
  waitForPluginToStart,
};
