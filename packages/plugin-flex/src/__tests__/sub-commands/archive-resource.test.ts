import { TwilioApiError } from '@twilio/flex-dev-utils';
import * as questions from '@twilio/flex-dev-utils/dist/questions';

import ArchiveResource from '../../sub-commands/archive-resource';
import createTest from '../framework';

jest.mock('@twilio/flex-dev-utils/dist/questions');
jest.mock('@segment/analytics-node', () => {
  const track = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      track,
    }),
  };
});

describe('SubCommands/ArchiveResource', () => {
  interface Resource {
    isArchived: boolean;
    name: string;
  }

  const resource: Resource = {
    isArchived: true,
    name: 'resource-name',
  };
  const doArchive = jest.fn();
  const getName = jest.fn();
  const getResourceType = jest.fn();
  const confirm = jest.spyOn(questions, 'confirm');

  class Plugin extends ArchiveResource<Resource> {
    async doArchive(): Promise<Resource> {
      return doArchive();
    }

    getName(): string {
      return getName();
    }

    getResourceType(): string {
      return getResourceType();
    }
  }

  const mockPrints = (cmd: Plugin) => {
    // @ts-ignore
    jest.spyOn(cmd.prints, 'archivedSuccessfully').mockReturnThis();
    // @ts-ignore
    jest.spyOn(cmd.prints, 'archivedFailed').mockReturnThis();
    // @ts-ignore
    jest.spyOn(cmd.prints, 'alreadyArchived').mockReturnThis();
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should successfully archive', async () => {
    const cmd = await createTest(Plugin)();

    confirm.mockResolvedValue(true);
    mockPrints(cmd);
    doArchive.mockResolvedValue(resource);
    const exit = jest.spyOn(cmd, 'exit');
    await cmd.doRun();

    expect(doArchive).toHaveBeenCalledTimes(1);
    expect(getName).toHaveBeenCalledTimes(2);
    expect(getResourceType).toHaveBeenCalledTimes(2);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(exit).not.toHaveBeenCalled();

    // @ts-ignore
    expect(cmd.prints.archivedSuccessfully).toHaveBeenCalledTimes(1);
  });

  it('should exit if not confirmed', async () => {
    const cmd = await createTest(Plugin)();

    confirm.mockResolvedValue(false);
    mockPrints(cmd);
    doArchive.mockResolvedValue(resource);
    const exit = jest.spyOn(cmd, 'exit').mockReturnThis();
    await cmd.doRun();

    expect(doArchive).not.toHaveBeenCalled();
    expect(getName).toHaveBeenCalledTimes(2);
    expect(getResourceType).toHaveBeenCalledTimes(2);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(0);
  });

  it('should fail to archive', async () => {
    const cmd = await createTest(Plugin)();

    confirm.mockResolvedValue(true);
    mockPrints(cmd);
    doArchive.mockResolvedValue({ ...resource, isArchived: false });
    await cmd.doRun();

    expect(doArchive).toHaveBeenCalledTimes(1);
    expect(getName).toHaveBeenCalledTimes(2);

    // @ts-ignore
    expect(cmd.prints.archivedSuccessfully).not.toHaveBeenCalled();
    // @ts-ignore
    expect(cmd.prints.archivedFailed).toHaveBeenCalledTimes(1);
  });

  it('should notify if already archived', async () => {
    const cmd = await createTest(Plugin)();

    confirm.mockResolvedValue(true);
    mockPrints(cmd);
    doArchive.mockRejectedValue(new TwilioApiError(400, '', 400));
    await cmd.doRun();

    expect(doArchive).toHaveBeenCalledTimes(1);
    expect(getName).toHaveBeenCalledTimes(2);

    // @ts-ignore
    expect(cmd.prints.archivedSuccessfully).not.toHaveBeenCalled();
    // @ts-ignore
    expect(cmd.prints.alreadyArchived).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception', async (done) => {
    const cmd = await createTest(Plugin)();
    const msg = 'some other message';

    confirm.mockResolvedValue(true);
    mockPrints(cmd);
    doArchive.mockRejectedValue(new TwilioApiError(400, msg, 500));

    try {
      await cmd.doRun();
    } catch (e) {
      expect(doArchive).toHaveBeenCalledTimes(1);
      expect(getName).toHaveBeenCalledTimes(2);

      // @ts-ignore
      expect(cmd.prints.archivedSuccessfully).not.toHaveBeenCalled();

      expect(e.message).toEqual(msg);
      done();
    }
  });
});
