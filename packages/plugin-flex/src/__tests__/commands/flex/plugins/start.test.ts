import { expect, createTest } from '../../../framework';
import FlexPluginsStart from '../../../../commands/flex/plugins/start';

describe('Commands/FlexPluginsStart', () => {
  const { sinon, start } = createTest(FlexPluginsStart);

  afterEach(() => {
    sinon.restore();
  });

  start()
    .setup((instance) => {
      sinon.stub(instance, 'runScript').returnsThis();
    })
    .test(async (instance) => {
      await instance.doRun();

      expect(instance.runScript).to.have.been.calledOnce;
      expect(instance.runScript).to.have.been.calledWith('start');
    })
    .it('should run start script');
});
