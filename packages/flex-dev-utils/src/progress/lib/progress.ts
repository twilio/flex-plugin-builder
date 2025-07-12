import env from '@twilio/flex-plugins-utils-env';

import { logger } from '../../logger';

export type Callback<R> = () => Promise<R>;

interface OraOptions {
  text: string;
  isEnabled?: boolean;
}

interface Progress {
  start: () => void;
  succeed: () => void;
  fail: (text?: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ora: any = null;
/* c8 ignore next */
const _getOra = () => {
  if (ora) {
    return ora;
  }

  // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
  ora = require('ora');

  return ora;
};

/**
 * Added for testing purposes
 * @param title
 * @param disabled
 */
/* c8 ignore next */
export const _getSpinner = (text: string, disabled: boolean): Progress => {
  if (disabled) {
    return {
      start: () => {
        // no-op
      },
      succeed: () => {
        // no-op
      },
      fail: () => {
        // no-op
      },
    };
  }

  const options: OraOptions = { text };
  if (env.isDebug() || env.isTrace()) {
    options.isEnabled = false;
  }

  return _getOra()(options);
};

/**
 * An {@link ora} progress wrapper
 *
 * @param title   the title to show
 * @param action  the callback to run
 * @param disabled force enable the progress
 */
export const progress = async <R>(title: string, action: Callback<R>, disabled = env.isQuiet()): Promise<R> => {
  const spinner = _getSpinner(logger.markdown(title) || '', disabled);

  try {
    spinner.start();
    const response = await action();
    spinner.succeed();

    return response;
  } catch (e) {
    spinner.fail(e.message);

    throw e;
  }
};

export default progress;
