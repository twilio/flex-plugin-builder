import * as pluginBuilderStartScript from 'flex-plugin-scripts/dist/scripts/start';

import { expect, createTest } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';
import { TwilioCliError } from '../../../../exceptions';
import * as fs from '../../../../utils/fs';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsStart);
  const pkg = {
    name: 'plugin-testOne',
    dependencies: {
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const badVersionPkg = {
    name: 'pluginBad',
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      'flex-plugin-scripts': '3.9.9',
    },
    devDependencies: {},
  };
  const badPluginsPkg = {
    name: 'fakePlugin',
    devDependencies: {},
    dependencies: {
      '@twilio/flex-ui': '1.0.0',
      'flex-plugin-scripts': '4.0.0',
    },
  };
  const config = {
    plugins: [
      { name: 'plugin-testOne', dir: 'test-dir', port: 0 },
      { name: 'plugin-testTwo', dir: 'test-dir', port: 0 },
      { name: 'pluginBad', dir: 'test-dir', port: 0 },
    ],
  };

  let findPortAvailablePort = sinon.stub(pluginBuilderStartScript, 'findPortAvailablePort');

  afterEach(() => {
    sinon.restore();

    findPortAvailablePort = sinon.stub(pluginBuilderStartScript, 'findPortAvailablePort');
  });

  start()
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(true);
      sinon.stub(instance, 'pkg').get(() => pkg);
      sinon.stub(instance, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(pkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (instance) => {
      await instance.doRun();

      expect(instance.pluginsConfig).to.equal(config);
      expect(instance.runScript).to.have.been.calledThrice;
      expect(instance.runScript).to.have.been.calledWith('start', ['flex', '--name', pkg.name]);
      expect(instance.runScript).to.have.been.calledWith('pre-start-check', ['--name', pkg.name]);
      expect(instance.runScript).to.have.been.calledWith('pre-script-check', ['--name', pkg.name]);
      expect(instance.spawnScript).to.have.been.calledWith('start', ['plugin', '--name', pkg.name, '--port', '100']);
    })
    .it('should run start script for the directory plugin');

  start()
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(true);
      sinon.stub(instance, 'pkg').get(() => badVersionPkg);
      sinon.stub(instance, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(badVersionPkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (instance) => {
      try {
        await instance.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('versioning is not compatible');
        expect(instance._flags.name).to.be.undefined;
        expect(instance._flags['include-remote']).to.be.undefined;
        expect(instance.runScript).have.been.calledTwice;
        expect(instance.runScript).to.have.been.calledWith('pre-start-check', ['--name', badVersionPkg.name]);
        expect(instance.runScript).to.have.been.calledWith('pre-script-check', ['--name', badVersionPkg.name]);
        expect(instance.spawnScript).not.to.have.been.called;
      }
    })
    .it('should error due to bad versioning');

  start()
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(true);
      sinon.stub(instance, 'pkg').get(() => badPluginsPkg);
      sinon.stub(instance, 'pluginsConfig').get(() => config);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (instance) => {
      try {
        await instance.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('was not found');
        expect(instance._flags.name).to.be.undefined;
        expect(instance._flags['include-remote']).to.be.undefined;
        expect(instance.runScript).have.been.calledTwice;
        expect(instance.runScript).to.have.been.calledWith('pre-start-check', ['--name', badPluginsPkg.name]);
        expect(instance.runScript).to.have.been.calledWith('pre-script-check', ['--name', badPluginsPkg.name]);
        expect(instance.spawnScript).not.to.have.been.called;
      }
    })
    .it('should error due to not being in the plugins.json file');

  start(['--name', 'plugin-testOne', '--name', 'plugin-testTwo', '--include-remote'])
    .setup(async (instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(false);
      sinon.stub(instance, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(pkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (instance) => {
      await instance.run();

      expect(instance._flags.name.includes('plugin-testOne'));
      expect(instance._flags.name.includes('plugin-testTwo'));
      expect(instance._flags.name.length).to.equal(2);
      expect(instance._flags['include-remote']).to.be.true;
    })
    .it('should read the name and include-remote flags');

  start(['--name', 'plugin-testOne'])
    .setup(async (instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(false);
      sinon.stub(instance, 'pluginsConfig').get(() => config);
      sinon.stub(fs, 'readJSONFile').returns(pkg);
      findPortAvailablePort.returns(Promise.resolve(100));
    })
    .test(async (instance) => {
      await instance.run();

      expect(instance._flags.name.includes('plugin-testOne'));
      expect(instance._flags.name.length).to.equal(1);
      expect(instance._flags['include-remote']).to.be.undefined;
    })
    .it('should process the one plugin');

  start(['--name', 'plugin-testOne@remote'])
    .setup(async (instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(false);
    })
    .test(async (instance) => {
      try {
        await instance.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('at least one local plugin');
        expect(instance.runScript).not.to.have.been.called;
        expect(instance.spawnScript).not.to.have.been.called;
      }
    })
    .it('should throw an error for no local plugins');

  start([''])
    .setup(async (instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'spawnScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(false);
      sinon.stub(instance, 'pluginsConfig').get(() => config);
    })
    .test(async (instance) => {
      try {
        await instance.run();
      } catch (e) {
        expect(e).to.be.instanceOf(TwilioCliError);
        expect(e.message).to.contain('not a flex plugin');
        expect(instance._flags.name).to.be.undefined;
        expect(instance._flags['include-remote']).to.be.undefined;
      }
    })
    .it('should throw an error if not in a plugin directory and no plugins given');
});
