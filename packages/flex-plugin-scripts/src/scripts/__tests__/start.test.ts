import * as startScript from '../start';
import * as run from '../../utils/run';

jest.mock('../../utils/require');
jest.mock('flex-dev-utils/dist/logger');
jest.mock('flex-dev-utils/dist/spawn');

// tslint:disable
const spawn = require('flex-dev-utils').spawn;
// tslint:enable

describe('start', () => {
  const exit = jest.spyOn(run, 'exit').mockReturnValue();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const expectSpawnCalled = (exitCode: number, ...args: string[]) => {
    const cracoString = expect.stringContaining('@craco/craco/bin/craco.js');

    expect(process.env.BROWSER).toContain('sub/browser.js');
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith('node', [cracoString, 'start', ...args]);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(exitCode, args);
  };

  it('should run craco start', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await startScript.default();
    expectSpawnCalled(0);
  });

  it('should exit if script fails', async () => {
    spawn.mockResolvedValue({ exitCode: 1 });

    await startScript.default();
    expectSpawnCalled(1);
  });

  it('should pass args to script', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    await startScript.default('arg1', 'arg2');
    expectSpawnCalled(0, 'arg1', 'arg2');
  });
});
