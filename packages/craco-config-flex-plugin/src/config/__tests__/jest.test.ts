import jestConfig from '../jest';
import * as utilsFs from '../../utils/fs';

jest.mock('path', () => ({
  join: (...args: string[]) => args.includes('@twilio/flex-ui') ? 'flex-ui' : 'app',
}));

describe('jest', () => {
  const params = {
    rootDir: 'the-root-dir',
  };

  it('ignore test pattern', () => {
    const config = jestConfig.configure({}, params);

    expect(config.testPathIgnorePatterns).toHaveLength(1);
    expect(config.testPathIgnorePatterns[0]).toEqual('/node_modules/');
  });

  it('should load custom config', () => {
    const loadFile = jest
      .spyOn(utilsFs, 'loadFile')
      .mockReturnValue({
        preset: 'foo',
      });

    const config = jestConfig.configure({}, params);

    expect(config.preset).toEqual('foo');

    loadFile.mockRestore();
  });
});
