import * as startScript from '../start';
import * as run from '../../utils/run';

jest.mock('../../utils/craco');
jest.mock('../../utils/require');

// tslint:disable
const craco = require('../../utils/craco').default;
// tslint:enable

describe('start', () => {
  const exit = jest.spyOn(run, 'exit').mockReturnValue();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const expectCalled = (exitCode: number, ...args: string[]) => {
    expect(process.env.BROWSER).toContain('sub/browser.js');
    expect(craco).toHaveBeenCalledTimes(1);
    expect(craco).toHaveBeenCalledWith('start', ...args);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(exitCode, args);
  };

  it('should call craco', async () => {
    craco.mockResolvedValue(0);

    await startScript.default();
    expectCalled(0);
  });

  it('should call craco with args', async () => {
    craco.mockResolvedValue(0);

    await startScript.default('arg1', 'arg2');
    expectCalled(0, 'arg1', 'arg2');
  });
});
