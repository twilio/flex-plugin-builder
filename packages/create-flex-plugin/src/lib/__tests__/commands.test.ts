import { packages } from '@twilio/flex-dev-utils';

import * as commands from '../commands';
import { FlexPluginArguments } from '../create-flex-plugin';
import * as github from '../../utils/github';

jest.mock('@twilio/flex-dev-utils/dist/spawn');

/* eslint-disable */
const { spawn } = require('@twilio/flex-dev-utils/dist/spawn');
/* eslint-enable */

describe('commands', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('installDependencies', () => {
    it('should install as npm', async () => {
      spawn.mockResolvedValue({ exitCode: 0 });

      await commands.installDependencies({
        yarn: false,
      } as FlexPluginArguments);

      expect(spawn).toHaveBeenCalledTimes(1);
      expect(spawn).toHaveBeenCalledWith('npm', expect.anything(), expect.anything());
    });

    it('should install as yarn', async () => {
      spawn.mockResolvedValue({ exitCode: 0 });

      await commands.installDependencies({
        yarn: true,
      } as FlexPluginArguments);

      expect(spawn).toHaveBeenCalledTimes(1);
      expect(spawn).toHaveBeenCalledWith('yarn', expect.anything(), expect.anything());
    });

    it('should pass correct args and options', async () => {
      spawn.mockResolvedValue({
        exitCode: 0,
        stdout: 'the-output',
      });

      const stdout = await commands.installDependencies({
        yarn: true,
        targetDirectory: '/tmp',
      } as FlexPluginArguments);
      const options = {
        cwd: '/tmp',
        shell: process.env.SHELL,
      };

      expect(spawn).toHaveBeenCalledWith('yarn', ['install'], options);
      expect(stdout).toEqual('the-output');
    });

    it('should throw an exception if exists with errorCode 1', async (done) => {
      spawn.mockResolvedValue({
        exitCode: 1,
        stderr: 'the-error',
      });

      try {
        await commands.installDependencies({
          yarn: true,
          targetDirectory: '/tmp',
        } as FlexPluginArguments);
      } catch (e) {
        expect(spawn).toHaveBeenCalledTimes(1);
        expect(e.message).toEqual('the-error');

        done();
      }
    });
  });

  describe('setupConfiguration', () => {
    it('should check the basics', async () => {
      const config = { name: 'plugin-name' } as FlexPluginArguments;
      const result = await commands.setupConfiguration(config);

      expect(result.pluginClassName).toEqual('NamePlugin');
      expect(result.pluginNamespace).toEqual('name');
      expect(result.targetDirectory).toEqual(expect.stringContaining('plugin-name'));
    });

    it('name should be set to empty string', async () => {
      const config = {} as FlexPluginArguments;

      const result = await commands.setupConfiguration(config);
      expect(result.pluginClassName).toEqual('Plugin');
    });

    it('should update the sdk version if flexui2 is true', async () => {
      const getLatestFlexUIVersion = jest.spyOn(packages, 'getLatestFlexUIVersion').mockResolvedValue('2.0.0');
      const config = { flexui2: true } as FlexPluginArguments;

      const result = await commands.setupConfiguration(config);
      expect(getLatestFlexUIVersion).toHaveBeenCalledTimes(1);
      expect(result.flexSdkVersion).toEqual('2.0.0');
    });

    it('should not update sdk version if flexui2 is false', async () => {
      const getLatestFlexUIVersion = jest.spyOn(packages, 'getLatestFlexUIVersion');
      const config = { flexui2: false } as FlexPluginArguments;

      await commands.setupConfiguration(config);
      expect(getLatestFlexUIVersion).not.toHaveBeenCalled();
    });
  });

  describe('downloadFromGitHub', () => {
    it('should download from GitHub', async () => {
      const info: github.GitHubInfo = {
        owner: 'twilio',
        repo: 'twilio-repo',
        ref: 'ref',
      };
      const parseGitHubUrl = jest.spyOn(github, 'parseGitHubUrl').mockResolvedValue(info);
      const downloadRepo = jest.spyOn(github, 'downloadRepo').mockResolvedValue();

      await commands.downloadFromGitHub('the-url', 'the-dir');

      expect(parseGitHubUrl).toHaveBeenCalledTimes(1);
      expect(parseGitHubUrl).toHaveBeenCalledWith('the-url');
      expect(downloadRepo).toHaveBeenCalledTimes(1);
      expect(downloadRepo).toHaveBeenCalledWith(info, 'the-dir');

      parseGitHubUrl.mockRestore();
      downloadRepo.mockRestore();
    });
  });
});
