import * as buildScript from '../build';
import * as run from '../../utils/run';

jest.mock('../../utils/craco');
jest.mock('../../utils/require');

// tslint:disable
const craco = require('../../utils/craco').default;
// tslint:enable

describe('build', () => {
  const exit = jest.spyOn(run, 'exit').mockReturnValue();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const expectCalled = (exitCode: number, ...args: string[]) => {
    expect(craco).toHaveBeenCalledTimes(1);
    expect(craco).toHaveBeenCalledWith('build', ...args);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(exitCode, args);
  };

  it('should call craco', async () => {
    craco.mockResolvedValue(0);

    await buildScript.default();
    expectCalled(0);
  });

  it('should call craco with args', async () => {
    craco.mockResolvedValue(0);

    await buildScript.default('arg1', 'arg2');
    expectCalled(0, 'arg1', 'arg2');
  });
});
