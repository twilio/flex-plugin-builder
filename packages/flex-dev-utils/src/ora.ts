import * as ora from 'ora';

export default ora.default;

export type OraCallback<T, R> = (arg: T) => R;

/**
 * Added for testing purposes
 * @param title
 */
/* istanbul ignore next */
export const _getSpinner = (title: string) => ora.default(title);

/**
 * Am {@link ora} progress wrapper
 *
 * @param title     the title to show
 * @param callback  the callback to run
 */
export const progress = async <R>(title: string, callback: OraCallback<ora.Ora, any>): Promise<R> => {
  const spinner = _getSpinner(title);

  try {
    spinner.start();
    const response = await callback(spinner);
    spinner.succeed();

    return response;
  } catch (e) {
    spinner.fail(e.message);

    throw e;
  }
};
