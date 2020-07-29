import { expect, createTest } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';
import { TwilioCliError } from '../../../../exceptions';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsStart);
  const pkg = {
    name: 'plugin-test',
  };

  afterEach(() => {
    sinon.restore();
  });

  start()
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(true);
      sinon.stub(instance, 'pkg').get(() => pkg);
    })
    .test(async (instance) => {
      await instance.doRun();

      expect(instance.runScript).to.have.been.calledThrice;
      expect(instance.runScript).to.have.been.calledWith('start', ['flex', '--name', pkg.name]);
      expect(instance.runScript).to.have.been.calledWith('start', ['plugin', '--name', pkg.name]);
      expect(instance.runScript).to.have.been.calledWith('check-start', ['--name', pkg.name]);
    })
    .it('should run start script for the directory plugin');

  start(['--name', 'plugin-testOne', '--name', 'plugin-testTwo', '--include-remote'])
    .setup(async (instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(false);
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
      sinon.stub(instance, 'isPluginFolder').returns(false);
    })
    .test(async (instance) => {
      await instance.run();

      expect(instance._flags.name.includes('plugin-testOne'));
      expect(instance._flags.name.length).to.equal(1);
      expect(instance._flags['include-remote']).to.be.undefined;
    })
    .it('should process the one plugin');

  start([''])
    .setup(async (instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
      sinon.stub(instance, 'isPluginFolder').returns(false);
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
