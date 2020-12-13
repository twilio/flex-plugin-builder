import startToolkit  from '../start';
import * as devUtils from 'flex-dev-utils';

jest.mock('flex-dev-utils');

describe('StartToolkit', () => {
  it('should invoke the start script', async () => {
    const spawn  = jest.spyOn(devUtils, 'spawn').mockReturnThis();

    await startToolkit( { cwd: 'the-cwd', name: 'the-name' });

    expect(spawn).toHaveBeenCalledTimes(3)
    expect(spawn).toHaveBeenCalledWith(
      'node',
      [
        expect.stringContaining('pre-script-check'),
        '--run-script',
        '--core-cwd',
        'the-cwd',
        '--cwd',
        'the-cwd'
      ],
    );
    expect(spawn).toHaveBeenCalledWith(
      'node',
      [
        expect.stringContaining('pre-start-check'),
        '--run-script',
        '--core-cwd',
        'the-cwd',
        '--cwd',
        'the-cwd'
      ],
    );
    expect(spawn).toHaveBeenCalledWith(
      'node',
      [
        expect.stringContaining('start'),
        '--run-script',
        '--core-cwd',
        'the-cwd',
        '--name',
        'the-name'
      ],
    );
  })
});

