import { expect, createTest } from '../../../framework';
import FlexPluginsBuild from '../../../../commands/flex/plugins/build';

describe('Commands/FlexPluginsBuild', () => {
  const { sinon, start } = createTest(FlexPluginsBuild);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsBuild.hasOwnProperty('flags')).to.equal(true);
  });

  start()
    .setup((cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => 4);
      sinon.stub(cmd, 'runScript').returnsThis();
    })
    .test(async (cmd) => {
      await cmd.doRun();

      expect(cmd.runScript).to.have.been.calledTwice;
      expect(cmd.runScript).to.have.been.calledWith('pre-script-check');
      expect(cmd.runScript).to.have.been.calledWith('build');
    })
    .it('should run build script');

  start()
    .test(async (cmd) => {
      expect(cmd.checkCompatibility).to.equal(true);
    })
    .it('should have compatibility set');
});
