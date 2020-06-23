import fs from 'fs';
import { logger, FlexPluginError } from 'flex-dev-utils';
import { rmRfSync } from 'flex-dev-utils/dist/fs';
import { CLIArguments } from '../cli';

import * as createFlexPluginScripts from '../create-flex-plugin';
import * as commands from '../commands';
import * as validators from '../../utils/validators';

jest.mock('flex-dev-utils/dist/logger');
jest.mock('../../prints/finalMessage');

describe('CreateFlexPlugin/create-flex-plugin', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const pluginName = 'plugin-test';
  const defaultArgs: CLIArguments = {
    name: pluginName,
    accountSid,
  };
  const defaultConfig = {
    ...defaultArgs,
    targetDirectory: '/target/directory',
    flexSdkVersion: '1.0.0',
    flexPluginVersion: '2.0.0',
    cracoConfigVersion: '3.0.0',
    pluginScriptsVersion: '4.0.0',
    pluginJsonContent: '{"plugin": "content"}',
    pluginClassName: 'TestPlugin',
    pluginNamespace: 'PluginTest',
  }

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
      const args = {...defaultArgs};
      const config = {...args, ...defaultConfig};

      const validate = jest
        .spyOn(validators, 'validate')
        .mockResolvedValue(args);
      const setupConfiguration = jest
        .spyOn(commands, 'setupConfiguration')
        .mockReturnValue(config);
      const installDependencies = jest
        .spyOn(commands, 'installDependencies');
      const scaffold = jest
        .spyOn(createFlexPluginScripts, '_scaffold')
        .mockResolvedValue(true);

      await createFlexPluginScripts.default(args);

      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith(args);
      expect(setupConfiguration).toHaveBeenCalledTimes(1);
      expect(scaffold).toHaveBeenCalledTimes(1);
      expect(installDependencies).not.toHaveBeenCalled();
    });

    it('should install the dependencies if specified', async () => {
      const args = {...defaultArgs, install: true};
      const config = {...args, ...defaultConfig};

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const validate = jest
        .spyOn(validators, 'validate')
        .mockResolvedValue(args);
      const setupConfiguration = jest
        .spyOn(commands, 'setupConfiguration')
        .mockReturnValue(config);
      const installDependencies = jest
        .spyOn(commands, 'installDependencies')
        .mockReturnThis();
      const scaffold = jest
        .spyOn(createFlexPluginScripts, '_scaffold')
        .mockResolvedValue(true);

      await createFlexPluginScripts.default(args);

      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith(args);
      expect(setupConfiguration).toHaveBeenCalledTimes(1);
      expect(scaffold).toHaveBeenCalledTimes(1);
      expect(installDependencies).toHaveBeenCalledTimes(1);
    });

    it('should quit if directory already exists', async (done) => {
      const args = {...defaultArgs, targetDirectory: '/tmp'};
      const config = {...args, ...defaultConfig};

      jest
        .spyOn(validators, 'validate')
        .mockResolvedValue(args);
      jest
        .spyOn(commands, 'setupConfiguration')
        .mockReturnValue(config);
      const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold');

      try {
        await createFlexPluginScripts.default(args);
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
      const args = {...defaultArgs, targetDirectory: '/tmp'};
      const config = {...args, ...defaultConfig};

      jest
        .spyOn(validators, 'validate')
        .mockResolvedValue(args);
      jest
        .spyOn(commands, 'setupConfiguration')
        .mockReturnValue(config);
      const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false);
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold')
        .mockResolvedValue(false);

      try {
        await createFlexPluginScripts.default(args);
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
      const args = {...defaultArgs, install: true};
      const config = {...args, ...defaultConfig};

      jest
        .spyOn(validators, 'validate')
        .mockResolvedValue(args);
      jest
        .spyOn(commands, 'setupConfiguration')
        .mockReturnValue(config);
      const scaffold = jest
        .spyOn(createFlexPluginScripts, '_scaffold')
        .mockResolvedValue(true);
      const install = jest
        .spyOn(createFlexPluginScripts, '_install')
        .mockResolvedValue(false);

      await createFlexPluginScripts.default(args);

      expect(logger.error).toHaveBeenCalled();
      expect(config.install).toBeFalsy();
      expect(install).toHaveBeenCalledTimes(1);
      expect(scaffold).toHaveBeenCalledTimes(1);
    });
  });
});
