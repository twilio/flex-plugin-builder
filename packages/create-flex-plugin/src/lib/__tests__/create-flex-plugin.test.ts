import fs from 'fs';
import { logger } from 'flex-dev-utils';
import { rmRfSync } from 'flex-dev-utils/dist/fs';

import { FlexPluginArguments } from '../create-flex-plugin';
import * as createFlexPluginScripts from '../create-flex-plugin';
import * as commands from '../commands';

jest.mock('flex-dev-utils/dist/logger');

describe('create-flex-plugin', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const pluginName = 'plugin-test';

  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

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
      const installDependencies = jest
        .spyOn(commands, 'installDependencies');

      await createFlexPluginScripts.default({
        name: pluginName,
        accountSid,
      } as FlexPluginArguments);

      expect(installDependencies).not.toHaveBeenCalled();
    });

    it('should install the dependencies if specified', async () => {
      const installDependencies = jest
        .spyOn(commands, 'installDependencies')
        .mockResolvedValue('');

      const config = {
        name: pluginName,
        accountSid,
        install: true,
      } as FlexPluginArguments;
      await createFlexPluginScripts.default(config);

      expect(installDependencies).toHaveBeenCalledTimes(1);
      expect(installDependencies).toHaveBeenCalledWith(config);
    });

    it('should quit if directory already exists', async () => {
      const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold');

      const config = {
        name: pluginName,
        accountSid,
        targetDirectory: '/tmp',
      } as FlexPluginArguments;

      await createFlexPluginScripts.default(config);

      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
      expect(scaffold).not.toHaveBeenCalled();

      existsSync.mockRestore();
      scaffold.mockRestore();
    });

    it('should warn if installation fails', async () => {
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold');
      const install = jest
        .spyOn(createFlexPluginScripts, '_install')
        .mockResolvedValue(false);

      const config = {
        name: pluginName,
        accountSid,
        install: true,
      } as FlexPluginArguments;
      await createFlexPluginScripts.default(config);

      expect(logger.error).toHaveBeenCalled();
      expect(config.install).toBeFalsy();
      expect(install).toHaveBeenCalledTimes(1);
      expect(scaffold).toHaveBeenCalledTimes(1);

      scaffold.mockRestore();
      install.mockRestore();
    });
  });
});
