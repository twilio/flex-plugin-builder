import fs from 'fs';

import { logger, FlexPluginError, Telemetry } from '@twilio/flex-dev-utils';
import * as fsScripts from '@twilio/flex-dev-utils/dist/fs';

import * as createFlexPluginScripts from '../create-flex-plugin';
import * as commands from '../commands';

jest.mock('@twilio/flex-dev-utils/dist/logger/lib/logger');
jest.mock('@twilio/flex-dev-utils/dist/telemetry/lib/telemetry');
jest.mock('../../prints/finalMessage');

describe('create-flex-plugin', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const pluginName = 'plugin-test';
  const pluginTargetDirectory = 'test-dir';

  const clearDir = () => {
    if (fs.existsSync(pluginName)) {
      fsScripts.rmRfSync(pluginName);
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(clearDir);
  afterAll(clearDir);

  describe('createFlexPlugin', () => {
    it('should append the new plugin to plugins.json', async () => {
      const checkPluginConfigurationExists = jest
        .spyOn(fsScripts, 'checkPluginConfigurationExists')
        .mockResolvedValue(true);

      const config = {
        name: pluginName,
        accountSid,
        targetDirectory: pluginTargetDirectory,
      } as createFlexPluginScripts.FlexPluginArguments;
      await createFlexPluginScripts.default(config);

      expect(checkPluginConfigurationExists).toHaveBeenCalledTimes(1);
      expect(checkPluginConfigurationExists).toHaveBeenCalledWith(config.name, config.targetDirectory);
    });

    it('should not install any dependency by default', async () => {
      const installDependencies = jest.spyOn(commands, 'installDependencies');

      await createFlexPluginScripts.default({
        name: pluginName,
        accountSid,
      } as createFlexPluginScripts.FlexPluginArguments);

      expect(installDependencies).not.toHaveBeenCalled();
    });

    it('should install the dependencies if specified', async () => {
      const installDependencies = jest.spyOn(commands, 'installDependencies').mockResolvedValue('');

      const config = {
        name: pluginName,
        accountSid,
        install: true,
      } as createFlexPluginScripts.FlexPluginArguments;
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
      } as createFlexPluginScripts.FlexPluginArguments;

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
      const scaffold = jest.spyOn(createFlexPluginScripts, '_scaffold').mockResolvedValue(false);

      const config = {
        name: pluginName,
        accountSid,
        targetDirectory: '/tmp',
      } as createFlexPluginScripts.FlexPluginArguments;

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
      const install = jest.spyOn(createFlexPluginScripts, '_install').mockResolvedValue(false);

      const config = {
        name: pluginName,
        accountSid,
        install: true,
      } as createFlexPluginScripts.FlexPluginArguments;

      await createFlexPluginScripts.default(config);

      expect(logger.error).toHaveBeenCalled();
      expect(config.install).toBeFalsy();
      expect(install).toHaveBeenCalledTimes(1);
      expect(scaffold).toHaveBeenCalledTimes(1);

      scaffold.mockRestore();
      install.mockRestore();
    });
  });

  describe('track function', () => {
    it('calls Telemetry.track with correct arguments', () => {
      const mockTimeTaken = 123;
      const mockConfig = {
        accountSid: 'AC123456789',
        pluginScriptsVersion: '1.0.0',
        name: 'TestPlugin',
        flexSdkVersion: '1.24.0',
        typescript: true,
      };

      createFlexPluginScripts.track(mockTimeTaken, mockConfig as any);
      expect(Telemetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('_scaffold', () => {
    it('should use typescript', async () => {
      const config = {
        name: pluginName,
        accountSid,
        install: true,
        typescript: true,
        targetDirectory: '',
      } as createFlexPluginScripts.FlexPluginArguments;

      const copyTemplateDir = jest.spyOn(fsScripts, 'copyTemplateDir').mockReturnThis();
      jest.spyOn(fs, 'renameSync').mockReturnThis();
      const downloadFromGitHub = jest.spyOn(commands, 'downloadFromGitHub').mockReturnThis();

      await createFlexPluginScripts._scaffold(config);
      expect(downloadFromGitHub).not.toHaveBeenCalled();
      expect(copyTemplateDir).toHaveBeenCalledTimes(2);
      expect(copyTemplateDir).toHaveBeenCalledWith(
        expect.toMatchPathContaining('templates/ts'),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should use template', async () => {
      const config = {
        name: pluginName,
        accountSid,
        install: true,
        template: 'the-template',
        targetDirectory: '',
      } as createFlexPluginScripts.FlexPluginArguments;

      const copyTemplateDir = jest.spyOn(fsScripts, 'copyTemplateDir').mockReturnThis();
      jest.spyOn(fs, 'renameSync').mockReturnThis();
      const downloadFromGitHub = jest.spyOn(commands, 'downloadFromGitHub').mockReturnThis();

      await createFlexPluginScripts._scaffold(config);
      expect(copyTemplateDir).toHaveBeenCalledTimes(2);
      expect(downloadFromGitHub).toHaveBeenCalledTimes(1);
      expect(copyTemplateDir).not.toHaveBeenCalledWith(
        expect.stringContaining('templates/ts2'),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should use typescript 1.0 template', async () => {
      const config = {
        name: pluginName,
        accountSid,
        install: true,
        typescript: true,
        targetDirectory: '',
        flexui1: true,
      } as createFlexPluginScripts.FlexPluginArguments;

      const copyTemplateDir = jest.spyOn(fsScripts, 'copyTemplateDir').mockReturnThis();
      jest.spyOn(fs, 'renameSync').mockReturnThis();
      const downloadFromGitHub = jest.spyOn(commands, 'downloadFromGitHub').mockReturnThis();

      await createFlexPluginScripts._scaffold(config);
      expect(downloadFromGitHub).not.toHaveBeenCalled();
      expect(copyTemplateDir).toHaveBeenCalledTimes(2);
      expect(copyTemplateDir).toHaveBeenCalledWith(
        expect.toMatchPathContaining('templates/ts'),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should use javascript 1.0 template', async () => {
      const config = {
        name: pluginName,
        accountSid,
        install: true,
        typescript: false,
        targetDirectory: '',
        flexui1: true,
      } as createFlexPluginScripts.FlexPluginArguments;

      const copyTemplateDir = jest.spyOn(fsScripts, 'copyTemplateDir').mockReturnThis();
      jest.spyOn(fs, 'renameSync').mockReturnThis();
      const downloadFromGitHub = jest.spyOn(commands, 'downloadFromGitHub').mockReturnThis();

      await createFlexPluginScripts._scaffold(config);
      expect(downloadFromGitHub).not.toHaveBeenCalled();
      expect(copyTemplateDir).toHaveBeenCalledTimes(2);
      expect(copyTemplateDir).toHaveBeenCalledWith(
        expect.toMatchPathContaining('templates/js'),
        expect.anything(),
        expect.anything(),
      );
    });
  });
});
