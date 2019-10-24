const runInformation = 'This command needs to be invoked inside a plugin directory.';

/**
 * Creates the description for the command
 * 
 * @param {string} description  the main description
 * @param {string} inDirectory  whether this command should be invoked inside a plugin directory or not
 * @returns {string} the updated command
 */
module.exports.createDescription = (description, inDirectory) => {
  description = `${description.trim().replace(/\.$/, '')}.`;
  if (!inDirectory) {
    return description;
  }

  return `${description} ${runInformation}`;
};