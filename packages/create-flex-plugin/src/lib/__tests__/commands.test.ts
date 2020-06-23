import { join } from 'path';

import { GitHubInfo } from '../../utils/github';
import * as commands from '../commands';
import { FlexPluginArguments } from '../create-flex-plugin';
import * as github from '../../utils/github';

jest.mock('flex-dev-utils/dist/spawn');

// tslint:disable
const pkg = require(join(process.cwd(), 'packages/create-flex-plugin/package.json'));
const spawn = require('flex-dev-utils').spawn;
// tslint:enable

describe('CreateFlexPlugin/commands', () => {

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
    it('should check the basics', () => {
      const config = { name: 'plugin-name' } as FlexPluginArguments;
      const _getPluginJsonContent = jest.spyOn(commands, '_getPluginJsonContent');
      const result = commands.setupConfiguration(config);

      expect(result.pluginClassName).toEqual('NamePlugin');
      expect(result.pluginNamespace).toEqual('name');
      expect(result.targetDirectory).toEqual(expect.stringContaining('plugin-name'));
      expect(_getPluginJsonContent).toHaveBeenCalledTimes(1);

      _getPluginJsonContent.mockRestore();
    });

    it('name should be set to empty string', () => {
      const config = { } as FlexPluginArguments;

      const result = commands.setupConfiguration(config);
      expect(result.pluginClassName).toEqual('Plugin');
    });
  });

  describe('downloadFromGitHub', () => {
    it('should download from GitHub', async () => {
      const info: GitHubInfo = {
        owner: 'twilio',
        repo: 'twilio-repo',
        ref: 'ref',
        isFlex: false,
      };
      const getTags = jest
        .spyOn(github, 'getTags');
      const parseGitHubUrl = jest
        .spyOn(github, 'parseGitHubUrl')
        .mockReturnValue({...info});
      const downloadRepo = jest
        .spyOn(github, 'downloadRepo')
        .mockResolvedValue(null);

      await commands.downloadFromGitHub('the-url', 'the-dir');

      expect(getTags).not.toHaveBeenCalled();
      expect(parseGitHubUrl).toHaveBeenCalledTimes(1);
      expect(parseGitHubUrl).toHaveBeenCalledWith('the-url');
      expect(downloadRepo).toHaveBeenCalledTimes(1);
      expect(downloadRepo).toHaveBeenCalledWith(info, 'the-dir');
    });

    it('should download an official template', async () => {
      const info: GitHubInfo = {
        owner: 'twilio',
        repo: 'twilio-repo',
        ref: 'master',
        isFlex: true,
      };
      const infoCalled = {
        ...info,
        ref: 'v3.6.7',
      }

      const getTags = jest
        .spyOn(github, 'getTags')
        .mockResolvedValue(['1.2.3', '1.2.4', '2.3.4', '3.4.5', '3.6.7', '4.2.0']);
      const parseGitHubUrl = jest
        .spyOn(github, 'parseGitHubUrl')
        .mockReturnValue({...info});
      const downloadRepo = jest
        .spyOn(github, 'downloadRepo')
        .mockResolvedValue(null);

      await commands.downloadFromGitHub('the-url', 'the-dir');

      expect(getTags).toHaveBeenCalledTimes(1);
      expect(getTags).toHaveBeenCalledWith(infoCalled);
      expect(parseGitHubUrl).toHaveBeenCalledTimes(1);
      expect(parseGitHubUrl).toHaveBeenCalledWith('the-url');
      expect(downloadRepo).toHaveBeenCalledTimes(1);
      expect(downloadRepo).toHaveBeenCalledWith(infoCalled, 'the-dir');
    });
  });

  describe('_getPluginJsonContent', () => {
    it('should return the content', () => {
      const config = {
        name: 'the-name',
        pluginClassName: 'the-class-name',
        flexSdkVersion: '1.2.3',
      } as FlexPluginArguments;

      const resp = commands._getPluginJsonContent(config);

      expect(resp).toHaveLength(1);
      expect(resp[0].name).toEqual(config.name);
      expect(resp[0].version).toEqual('0.0.0');
      expect(resp[0].class).toEqual(config.pluginClassName);
      expect(resp[0].src).toEqual(expect.stringContaining(config.name as string));
    });
  });
});
