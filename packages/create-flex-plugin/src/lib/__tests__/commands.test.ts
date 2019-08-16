import * as commands from '../commands';
import { FlexPluginArguments } from '../create-flex-plugin';

jest.mock('flex-dev-utils/dist/spawn');

// tslint:disable
const spawn = require('flex-dev-utils').spawn;
// tslint:enable

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
});
