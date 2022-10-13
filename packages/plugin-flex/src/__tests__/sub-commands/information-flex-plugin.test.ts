import { TwilioApiError } from '@twilio/flex-dev-utils';

import createTest from '../framework';
import InformationFlexPlugin from '../../sub-commands/information-flex-plugin';
import FlexPlugin from '../../sub-commands/flex-plugin';

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

  const createCommand = async (...args: string[]): Promise<SamplePlugin> => {
    const cmd = await createTest(SamplePlugin)(...args);
    await cmd.init();
    return cmd;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...env };
  });

  it('should have own flags', () => {
    expect(InformationFlexPlugin.flags).not.toBeSameObject(FlexPlugin.flags);
  });

  it('should call getResource and then print result', async () => {
    const cmd = await createCommand();

    jest.spyOn(cmd, 'notFound');
    jest.spyOn(cmd, 'print');
    jest.spyOn(cmd, 'getResource');

    await cmd.doRun();

    expect(cmd.print).toHaveBeenCalledTimes(1);
    expect(cmd.getResource).toHaveBeenCalledTimes(1);
    expect(cmd.notFound).not.toHaveBeenCalledTimes(1);
    expect(cmd.print).toHaveBeenCalledWith(resource);
  });

  it('should call notFound if getResource throws error not-found', async () => {
    const cmd = await createCommand();

    jest.spyOn(cmd, 'notFound');
    jest.spyOn(cmd, 'print');
    jest.spyOn(cmd, 'getResource').mockRejectedValue(new TwilioApiError(20404, 'error-message', 404));
    jest.spyOn(cmd, 'exit').mockReturnThis();
    await cmd.doRun();

    expect(cmd.print).not.toHaveBeenCalledTimes(1);
    expect(cmd.getResource).toHaveBeenCalledTimes(1);
    expect(cmd.notFound).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledTimes(1);
    expect(cmd.exit).toHaveBeenCalledWith(1);
  });

  it('should should return --json if flag is set', async () => {
    const cmd = await createCommand('--json');

    jest.spyOn(cmd, 'notFound');
    jest.spyOn(cmd, 'print');
    jest.spyOn(cmd, 'getResource');

    const result = await cmd.doRun();

    expect(cmd.print).not.toHaveBeenCalledTimes(1);
    expect(cmd.getResource).toHaveBeenCalledTimes(1);
    expect(cmd.notFound).not.toHaveBeenCalledTimes(1);
    expect(result).toEqual(resource);
  });
});
