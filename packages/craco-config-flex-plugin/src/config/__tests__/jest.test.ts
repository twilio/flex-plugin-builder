import jestConfig from '../jest';

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
});
