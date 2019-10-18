import * as craco from '../craco';

jest.mock('../require');
jest.mock('flex-dev-utils/dist/spawn');

// tslint:disable
const spawn = require('flex-dev-utils').spawn;
const resolve = require('../require').resolve;
// tslint:enable

describe('craco', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    resolve.mockReturnValue('craco-path');
  });

  const expectSpawnCalled = (cmd: craco.CracoCmd, ...args: string[]) => {
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith('@craco/craco/bin/craco.js');
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith('node', ['craco-path', cmd, ...args]);
  };

  it('should call build', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    const exitCode = await craco.default('build');

    expect(exitCode).toEqual(0);
    expectSpawnCalled('build');
  });

  it('should call start with args', async () => {
    spawn.mockResolvedValue({ exitCode: 0 });

    const exitCode = await craco.default('build', 'arg1', 'arg2');

    expect(exitCode).toEqual(0);
    expectSpawnCalled('build', 'arg1', 'arg2');
  });
});
