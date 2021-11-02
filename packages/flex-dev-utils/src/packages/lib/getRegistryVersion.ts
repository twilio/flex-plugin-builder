import packageJson from 'package-json';

/**
 * Fetches the version corresponding to the dependency inside the flex-ui package.json
 * @param name the package to check
 */
/* istanbul ignore next */
const getVersionOfDependency = async (module: string, tag: 'latest' | 'alpha' | 'beta') =>
  packageJson(module, { version: tag });

export default getVersionOfDependency;
