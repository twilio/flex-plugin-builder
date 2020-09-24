import { expect, createTest } from '../../../framework';
import FlexPluginsTest from '../../../../commands/flex/plugins/test';

describe('Commands/FlexPluginsTest', () => {
  const { sinon, start } = createTest(FlexPluginsTest);

  afterEach(() => {
    sinon.restore();
  });

  start()
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
    })
    .test(async (instance) => {
      await instance.doRun();

      expect(instance.runScript).to.have.been.calledTwice;
      expect(instance.runScript).to.have.been.calledWith('pre-script-check');
      expect(instance.runScript).to.have.been.calledWith('test', ['--env=jsdom']);
    })
    .it('should run test script');
});
