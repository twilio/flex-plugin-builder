import cli from '../src/cli';
import createFlexPlugin from '../src/create-flex-plugin';

jest.mock('../src/create-flex-plugin');

describe('create-flex-plugin cli', () => {
  it('should call createFlexPlugin', () => {
    // Act
    cli({});

    // Assert
    expect(createFlexPlugin).toHaveBeenCalled();
  });
});
