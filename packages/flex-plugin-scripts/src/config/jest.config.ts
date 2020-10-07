import { InitialOptions } from '@jest/types/build/Config';
import { getPaths } from 'flex-dev-utils/dist/fs';

export {
  JestConfigurations
} from 'flex-plugin-test';

/**
 * Main method for generating a default Jest configuration
 */
export default (): Partial<InitialOptions> => {
  return {
    rootDir: getPaths().cwd,
    preset: `${getPaths().scripts.nodeModulesDir}/flex-plugin-test`,
  };
}
