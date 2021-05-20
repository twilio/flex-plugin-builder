import axios from 'axios';
import { logger } from 'flex-plugins-utils-logger';

/**
 * Waits for plugin to start at the given url
 */
const waitForPluginToStart = async (url: string): Promise<void> => {
  let counter = 0;

  while (true) {
    try {
      await axios.get(url);
      break;
    } catch (e) {
      if (counter === 10000) {
        logger.error(e);
        throw new Error('Plugin did not start');
      }
    }

    // eslint-disable-next-line no-loop-func
    await new Promise((r) => setTimeout(r, 1000));
    counter += 1000;
  }
};

export default {
  waitForPluginToStart,
};
