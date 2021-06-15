import { readdirSync } from 'fs';

import { TestParams } from './parameters';

export interface TestSuite {
  (params: TestParams): Promise<void>;
  before?: (params: TestParams) => Promise<void>;
  after?: (params: TestParams) => Promise<void>;
  description: string;
}

/**
 * All the test suites that need to run
 */
export const testSuites = readdirSync(`${__dirname}/../tests`)
  .filter((f) => f.endsWith('.js'))
  .filter((f) => f.startsWith('step'))
  .sort((l, r) => {
    if (parseInt(l.split('step')[1], 10) > parseInt(r.split('step')[1], 10)) {
      return 1;
    }

    return -1;
  });
