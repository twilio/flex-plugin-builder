// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructable<T> = new (...args: any[]) => T;

export const _runInformation = 'This command needs to be invoked inside a plugin directory.';

/**
 * Creates the description for the command
 *
 * @param {string} description  the main description
 * @param {boolean} inDirectory  whether this command should be invoked inside a plugin directory or not
 * @returns {string} the updated command
 */
export const createDescription = (description: string, inDirectory: boolean = true) => {
  description = `${description.trim().replace(/\.$/, '')}.`;
  if (!inDirectory) {
    return description;
  }

  return `${description} ${_runInformation}`;
};

/**
 * Checks whether an object is instance of a given class
 * @param instance  the instance to check
 * @param klass     the class to check
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const instanceOf = <T>(instance: Object, klass: Constructable<T>): boolean => {
  // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
  while (instance && instance !== Object.prototype) {
    if (!instance || !instance.constructor || !instance.constructor.name) {
      return false;
    }

    if (klass.name === instance.constructor.name) {
      return true;
    }

    instance = Object.getPrototypeOf(instance);
  }

  return false;
};

/**
 * Exits the application
 * @param exitCode  the exit code
 */
export const exit = (exitCode = 1) => {
  // eslint-disable-next-line no-process-exit
  process.exit(exitCode);
};
