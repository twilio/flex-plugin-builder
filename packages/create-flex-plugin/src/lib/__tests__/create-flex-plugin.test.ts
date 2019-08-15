import execa from 'execa';
import fs from 'fs';
import { rmRfSync } from 'flex-dev-utils/dist/fs';

import createFlexPlugin from '../create-flex-plugin';

jest.mock('flex-dev-utils/dist/logger');

describe('create-flex-plugin', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const pluginName = 'plugin-test';

  const clearDir = () => {
    if (fs.existsSync(pluginName)) {
      rmRfSync(pluginName);
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(clearDir);
  afterAll(clearDir);

  describe('createFlexPlugin', () => {
    it('should not install any dependency by default', async () => {
      await createFlexPlugin({
        name: pluginName,
        accountSid,
      } as any);

      expect(execa).not.toHaveBeenCalled();
    });

    it('should install the dependencies if specified', async () => {
      await createFlexPlugin({
        name: pluginName,
        accountSid,
        install: true,
      } as any);

      expect(execa).toHaveBeenCalled();
    });
  });
});
