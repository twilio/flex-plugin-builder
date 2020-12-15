import * as fsScript from 'flex-dev-utils/dist/fs';

import jestFactory from '..';

describe('JestConfiguration', () => {
  const paths = {
    cwd: 'the/working/dir',
    app: {
      nodeModulesDir: 'app/node_modules',
      setupTestsPaths: [],
    },
    scripts: {
      nodeModulesDir: 'scripts/node_modules',
    },
    cli: {
      nodeModulesDir: 'cli/node_modules',
    },
    extensions: ['js', 'jsx', 'ts', 'tsx'],
  };

  beforeEach(() => {
    jest.resetAllMocks();

    // @ts-ignore
    jest.spyOn(fsScript, 'getPaths').mockReturnValue(paths);
  });

  it('should test the basic configs', () => {
    const config = jestFactory();

    expect(config.roots).toHaveLength(1);
    expect(config.roots[0]).toEqual('<rootDir>/src');

    expect(config.collectCoverageFrom).toHaveLength(2);
    expect(config.setupFiles).toHaveLength(1);
    expect(config.testMatch).toHaveLength(2);
    expect(config.transformIgnorePatterns).toHaveLength(2);
    expect(config.watchPlugins).toHaveLength(2);
    expect(Object.keys(config.transform)).toHaveLength(2);
  });

  it('should use default testFile', () => {
    const config = jestFactory();

    expect(config.setupFilesAfterEnv).toHaveLength(1);
    expect(config.setupFilesAfterEnv[0]).toContain('templates');
  });
});
