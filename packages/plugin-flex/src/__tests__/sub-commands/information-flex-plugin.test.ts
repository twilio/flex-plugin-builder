import { TwilioApiError } from 'flex-plugins-utils-exception';

import { expect, createTest } from '../framework';
import InformationFlexPlugin from '../../sub-commands/information-flex-plugin';

describe('SubCommands/InformationFlexPlugin', () => {
  interface Sample {
    key: string;
  }
  const resource: Sample = { key: 'value' };

  class SamplePlugin extends InformationFlexPlugin<Sample> {
    async getResource(): Promise<Sample> {
      return Promise.resolve(resource);
    }

    notFound() {
      // No-op
    }

    print() {
      // No-op
    }
  }

  const { env } = process;
  const { sinon, start } = createTest(SamplePlugin);

  beforeEach(() => {
    process.env = { ...env };
  });

  afterEach(() => {
    sinon.restore();
  });

  start()
    .setup((cmd) => {
      sinon.spy(cmd, 'notFound');
      sinon.spy(cmd, 'print');
      sinon.spy(cmd, 'getResource');
    })
    .test(async (cmd) => {
      await cmd.doRun();

      expect(cmd.print).to.have.been.called;
      expect(cmd.getResource).to.have.been.called;
      expect(cmd.notFound).not.to.have.been.called;
      expect(cmd.print).to.have.been.calledWith(resource);
    })
    .it('should call getResource and then print result');

  start()
    .setup((cmd) => {
      sinon.spy(cmd, 'notFound');
      sinon.spy(cmd, 'print');
      sinon.stub(cmd, 'getResource').rejects(new TwilioApiError(20404, 'error-message', 404));
      sinon.stub(cmd, 'exit');
    })
    .test(async (cmd) => {
      await cmd.doRun();

      expect(cmd.print).not.to.have.been.called;
      expect(cmd.getResource).to.have.been.called;
      expect(cmd.notFound).to.have.been.called;
      expect(cmd.exit).to.have.been.called;
      expect(cmd.exit).to.have.been.calledWith(1);
    })
    .it('should call notFound if getResource throws error not-found');

  start(['--json'])
    .setup((cmd) => {
      sinon.spy(cmd, 'notFound');
      sinon.spy(cmd, 'print');
      sinon.spy(cmd, 'getResource');
    })
    .test(async (cmd) => {
      const result = await cmd.doRun();

      expect(cmd.print).not.to.have.been.called;
      expect(cmd.getResource).to.have.been.called;
      expect(cmd.notFound).not.to.have.been.called;
      expect(result).to.equal(resource);
    })
    .it('should should return --json if flag is set');
});
