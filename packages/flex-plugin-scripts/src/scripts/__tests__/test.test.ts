import * as testScript from '../test';
import * as run from '../../utils/run';

jest.mock('../../utils/craco');
jest.mock('../../utils/require');

// tslint:disable
const craco = require('../../utils/craco').default;
// tslint:enable

describe('test', () => {
  const exit = jest.spyOn(run, 'exit').mockReturnValue();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const expectCalled = (exitCode: number, ...args: string[]) => {
    expect(craco).toHaveBeenCalledTimes(1);
    expect(craco).toHaveBeenCalledWith('test', ...args);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(exitCode, args);
  };

  it('should call craco', async () => {
    craco.mockResolvedValue(0);

    await testScript.default();
    expectCalled(0);
  });

  it('should call craco with args', async () => {
    craco.mockResolvedValue(0);

    await testScript.default('arg1', 'arg2');
    expectCalled(0, 'arg1', 'arg2');
  });
});
