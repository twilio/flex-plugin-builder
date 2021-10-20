import * as spawnUtils from 'flex-dev-utils/dist/spawn';

import buildToolkit from '../build';

jest.mock('flex-dev-utils/dist/spawn');

describe('BuildToolkit', () => {
  it('should invoke the build script', async () => {
    const spawn = jest.spyOn(spawnUtils, 'spawn').mockReturnThis();

    await buildToolkit({ cwd: 'the-cwd', name: 'the-name' });

    expect(spawn).toHaveBeenCalledTimes(2);
    expect(spawn).toHaveBeenCalledWith('node', [
      expect.stringContaining('pre-script-check'),
      '--run-script',
      '--core-cwd',
      'the-cwd',
      '--cwd',
      'the-cwd',
    ]);
    expect(spawn).toHaveBeenCalledWith('node', [
      expect.stringContaining('build'),
      '--run-script',
      '--core-cwd',
      'the-cwd',
      '--name',
      'the-name',
    ]);
  });
});
