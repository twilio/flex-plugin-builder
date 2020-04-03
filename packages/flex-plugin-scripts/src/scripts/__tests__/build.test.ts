import * as buildScript from '../build';
import * as run from '../../utils/run';

jest.mock('../../utils/require');

describe('build', () => {
  const exit = jest.spyOn(run, 'exit').mockReturnValue();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const expectCalled = (exitCode: number, ...args: string[]) => {
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(exitCode, args);
  };
});
