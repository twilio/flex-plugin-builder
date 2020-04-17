import jestFactory from '../jest.config';

jest.mock('flex-dev-utils/dist/paths', () => ({
  cwd: 'the/working/dir',
  app: {
    setupTestsPaths: [],
  },
  extensions: ['js', 'jsx', 'ts', 'tsx'],
}));

describe('JestConfiguration', () => {
  it('should test the basic configs', () => {
    const config = jestFactory();

    expect(config.rootDir).toEqual('the/working/dir');

    expect(config.roots).toHaveLength(1);
    expect(config.roots[0]).toEqual('<rootDir>/src');

    expect(config.collectCoverageFrom).toHaveLength(2);
    expect(config.setupFiles).toHaveLength(1);
    expect(config.testMatch).toHaveLength(2);
    expect(config.transformIgnorePatterns).toHaveLength(2);
    expect(config.watchPlugins).toHaveLength(2);
    expect(Object.keys(config.transform)).toHaveLength(2);
  });

  it('should not have setupTestsFile', () => {
    const config = jestFactory();

    expect(config.setupFilesAfterEnv).toHaveLength(0);
  });
});
