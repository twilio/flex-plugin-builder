import { expect, createTest } from '../../../framework';
import FlexPluginsRemove from '../../../../commands/flex/plugins/remove';

describe('Commands/FlexPluginsRemove', () => {
  const { sinon, start } = createTest(FlexPluginsRemove);

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
      expect(instance.runScript).to.have.been.calledWith('remove');
    })
    .it('should run remove script');
});
