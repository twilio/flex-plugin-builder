import deployToolkit  from '../deploy';
import * as devUtils from 'flex-dev-utils';

jest.mock('flex-dev-utils');

describe('DeployToolkit', () => {
  it('should invoke the deploy script', async () => {
    const spawn  = jest.spyOn(devUtils, 'spawn').mockReturnThis();

    await deployToolkit( { cwd: 'the-cwd', name: 'the-name' });

    expect(spawn).toHaveBeenCalledTimes(2)
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
        expect.stringContaining('deploy'),
        '--run-script',
        '--core-cwd',
        'the-cwd',
        '--name',
        'the-name'
      ],
    );
  })
});

