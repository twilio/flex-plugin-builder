import cli from '../../src/lib/cli';
import createFlexPlugin from '../../src/lib/create-flex-plugin';

jest.mock('../../src/lib/create-flex-plugin');

describe('cli', () => {
  it('should call createFlexPlugin', () => {
    cli(null).parse([]);

    expect(createFlexPlugin).toHaveBeenCalled();
  });
});
