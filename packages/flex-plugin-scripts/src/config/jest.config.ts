import { join } from 'path';

import { InitialOptions } from '@jest/types/build/Config';
import { getPaths } from '@twilio/flex-dev-utils/dist/fs';

export { JestConfigurations } from '@twilio/flex-plugin-test';

/**
 * Main method for generating a default Jest configuration
 */
export default (): Partial<InitialOptions> => {
  return {
    rootDir: getPaths().cwd,
    preset: join(require.resolve('@twilio/flex-plugin-test'), '..', '..'),
  };
};
