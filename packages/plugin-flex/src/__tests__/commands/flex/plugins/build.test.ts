import { expect, createTest } from '../../../framework';
import FlexPluginsBuild from '../../../../commands/flex/plugins/build';
import { IncompatibleVersionError } from '../../../../exceptions';
import { instanceOf } from '../../../../utils/general';

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
    .setup((cmd) => {
      sinon.stub(cmd, 'builderVersion').get(() => null);
    })
    .test(async (cmd) => {
      await cmd.doRun();
    })
    .catch((e) => {
      expect(instanceOf(e, IncompatibleVersionError)).to.equal(true);
    })
    .it('should throw error if not using plugin-builder 4');
});
