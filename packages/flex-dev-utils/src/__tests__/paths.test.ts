import * as fs from '../fs';

describe('paths', () => {
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { /* no-op */ });

  const validPackage = {
    name: 'plugin-test',
    version: '1.2.3',
    dependencies: {
      'flex-plugin-scripts': '1',
      'flex-plugin': '2'
    },
  };

  it('should give you the paths', () => {
    const readPackageJson = jest
      .spyOn(fs, 'readPackageJson')
      .mockReturnValue(validPackage);

    const paths = require('../paths').default;

    expect(exit).not.toHaveBeenCalled();

    // build/ directory
    expect(paths().app.buildDir).toEqual(expect.stringMatching('build$'));
    expect(paths().app.bundlePath).toContain('build');
    expect(paths().app.bundlePath).toContain(validPackage.name);
    expect(paths().app.bundlePath).toEqual(expect.stringMatching('\.js$'));
    expect(paths().app.sourceMapPath).toContain('build');
    expect(paths().app.sourceMapPath).toContain(validPackage.name);
    expect(paths().app.sourceMapPath).toEqual(expect.stringMatching('\.js\.map$'));

    // src/ directory
    expect(paths().app.srcDir).toEqual(expect.stringMatching('src$'));
    expect(paths().app.entryPath).toContain('src');
    expect(paths().app.entryPath).toEqual(expect.stringMatching('index$'));

    // node_modules/ directory
    expect(paths().app.nodeModulesDir).toEqual(expect.stringMatching('node_modules$'));
    expect(paths().app.flexUIDir).toContain('node_modules');
    expect(paths().app.flexUIDir).toContain('@twilio/flex-ui');
    expect(paths().app.flexUIPkgPath).toContain('@twilio/flex-ui');
    expect(paths().app.flexUIPkgPath).toEqual(expect.stringMatching('package\.json$'));

    // scripts
    expect(paths().scripts.devAssetsDir).toContain('flex-plugin-scripts');

    // public/ directory
    expect(paths().app.publicDir).toEqual(expect.stringMatching('public$'));
    expect(paths().app.indexHtmlPath).toEqual(expect.stringMatching('index\.html$'));
    expect(paths().app.appConfig).toEqual(expect.stringMatching('appConfig\.js$'));
    expect(paths().app.pluginsJsonPath).toEqual(expect.stringMatching('plugins\.json$'));

    // package.json
    expect(paths().app.name).toEqual('plugin-test');
    expect(paths().app.version).toEqual('1.2.3');

    // typescript
    expect(paths().app.tsConfigPath).toContain('tsconfig.json');
    expect(paths().app.isTSProject()).toEqual(true);

    // setup tests
    expect(paths().app.setupTestsPaths).toHaveLength(2);
    expect(paths().app.setupTestsPaths[0]).toContain('setupTests.js');
    expect(paths().app.setupTestsPaths[0]).not.toContain('src');
    expect(paths().app.setupTestsPaths[1]).toContain('setupTests.js');
    expect(paths().app.setupTestsPaths[1]).toContain('src');

    // others
    expect(paths().assetBaseUrlTemplate).toContain('plugin-test/%PLUGIN_VERSION%');

    readPackageJson.mockRestore();
  });
});
