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
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
    })
    .test(async (instance) => {
      await instance.doRun();

      expect(instance.runScript).to.have.been.calledTwice;
      expect(instance.runScript).to.have.been.calledWith('pre-script-check');
      expect(instance.runScript).to.have.been.calledWith('build');
    })
    .it('should run build script');
});
