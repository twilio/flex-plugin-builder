import { expect, createTest } from '../../../framework';
import FlexPluginsTest from '../../../../commands/flex/plugins/test';

describe('Commands/FlexPluginsTest', () => {
  const { sinon, start } = createTest(FlexPluginsTest);

  afterEach(() => {
    sinon.restore();
  });

  it('should have flag as own property', () => {
    expect(FlexPluginsTest.hasOwnProperty('flags')).to.equal(true);
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
      expect(cmd.runScript).to.have.been.calledWith('test', ['--env=jsdom']);
    })
    .it('should run test script');

  start()
    .test(async (cmd) => {
      expect(cmd.checkCompatibility).to.equal(true);
    })
    .it('should have compatibility set');
});
