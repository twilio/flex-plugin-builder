import ora, { Ora } from 'ora';

export default ora;

export type OraCallback<T, R> = (arg: T) => R;

/**
 * Am {@link ora} progress wrapper
 *
 * @param title     the title to show
 * @param callback  the callback to run
 */
export const progress = async <R>(title: string, callback: OraCallback<Ora, any>): Promise<R> => {
  const spinner = ora(title);

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
