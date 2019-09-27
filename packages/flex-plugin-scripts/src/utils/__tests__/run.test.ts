import * as run from '../run';

describe('run', () => {
  it('should run successfully', async () => {
    const cb = jest.fn();
    await run.default(cb);

    expect(cb).toHaveBeenCalledTimes(1);
  });
});
