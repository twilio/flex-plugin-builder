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
