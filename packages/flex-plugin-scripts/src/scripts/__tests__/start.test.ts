import * as startScript from '../start';
import * as run from '../../utils/run';
import * as serverScripts from '../start/server';

jest.mock('../start/server');
jest.mock('../../utils/require');

// tslint:disable
const findPorts = require('../start/server').findPorts;
// tslint:enable

describe('start', () => {
  const exit = jest.spyOn(run, 'exit').mockReturnValue();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const expectCalled = (exitCode: number, ...args: string[]) => {
    expect(process.env.BROWSER).toContain('start/browser.js');
    expect(process.env.PORT).toBe('3210');
    expect(findPorts).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(exitCode, args);
  };

  it('should call craco', async () => {
    findPorts.mockResolvedValue(3210);

    await startScript.default();
    expectCalled(0);
  });

  it('should call craco with args', async () => {
    findPorts.mockResolvedValue(3210);

    await startScript.default('arg1', 'arg2');
    expectCalled(0, 'arg1', 'arg2');
  });
});
