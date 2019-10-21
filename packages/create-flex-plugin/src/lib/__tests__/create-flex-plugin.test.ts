import { FlexPluginError } from 'flex-dev-utils/dist/errors';
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

  const clearDir = () => {
    if (fs.existsSync(pluginName)) {
      rmRfSync(pluginName);
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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

    it('should quit if directory already exists', async (done) => {
      const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold');

      const config = {
        name: pluginName,
        accountSid,
        targetDirectory: '/tmp',
      } as FlexPluginArguments;

      try {
        await createFlexPluginScripts.default(config);
      } catch (e) {
        expect(scaffold).not.toHaveBeenCalled();
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('already exists');

        existsSync.mockRestore();
        scaffold.mockRestore();

        done();
      }
    });

    it('should quit if scaffolding fails', async (done) => {
      const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold')
        .mockResolvedValue(false);

      const config = {
        name: pluginName,
        accountSid,
        targetDirectory: '/tmp',
      } as FlexPluginArguments;

      try {
        await createFlexPluginScripts.default(config);
      } catch (e) {
        expect(scaffold).toHaveBeenCalledTimes(1);
        expect(e).toBeInstanceOf(FlexPluginError);
        expect(e.message).toContain('Failed');
        expect(e.message).toContain('scaffold project');

        existsSync.mockRestore();
        scaffold.mockRestore();

        done();
      }
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
