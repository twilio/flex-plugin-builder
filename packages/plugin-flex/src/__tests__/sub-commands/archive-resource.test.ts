import { TwilioApiError } from 'flex-dev-utils';

import ArchiveResource from '../../sub-commands/archive-resource';
import createTest from '../framework';

describe('SubCommands/ArchiveResource', () => {
  interface Resource {
    isArchived: boolean;
    name: string;
  }

  const resource: Resource = {
    isArchived: true,
    name: 'resource-name',
  };
  const doArchie = jest.fn();
  const getName = jest.fn();

  class Plugin extends ArchiveResource<Resource> {
    async doArchive(): Promise<Resource> {
      return doArchie();
    }

    getName(): string {
      return getName();
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

    mockPrints(cmd);
    doArchie.mockResolvedValue(resource);
    await cmd.doRun();

    expect(doArchie).toHaveBeenCalledTimes(1);
    expect(getName).toHaveBeenCalledTimes(1);

    // @ts-ignore
    expect(cmd.prints.archivedSuccessfully).toHaveBeenCalledTimes(1);
  });

  it('should fail to archive', async () => {
    const cmd = await createTest(Plugin)();

    mockPrints(cmd);
    doArchie.mockResolvedValue({ ...resource, isArchived: false });
    await cmd.doRun();

    expect(doArchie).toHaveBeenCalledTimes(1);
    expect(getName).toHaveBeenCalledTimes(1);

    // @ts-ignore
    expect(cmd.prints.archivedSuccessfully).not.toHaveBeenCalled();
    // @ts-ignore
    expect(cmd.prints.archivedFailed).toHaveBeenCalledTimes(1);
  });

  it('should notify if already archived', async () => {
    const cmd = await createTest(Plugin)();

    mockPrints(cmd);
    doArchie.mockRejectedValue(new TwilioApiError(400, '', 400));
    await cmd.doRun();

    expect(doArchie).toHaveBeenCalledTimes(1);
    expect(getName).toHaveBeenCalledTimes(1);

    // @ts-ignore
    expect(cmd.prints.archivedSuccessfully).not.toHaveBeenCalled();
    // @ts-ignore
    expect(cmd.prints.alreadyArchived).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception', async (done) => {
    const cmd = await createTest(Plugin)();
    const msg = 'some other message';

    mockPrints(cmd);
    doArchie.mockRejectedValue(new TwilioApiError(400, msg, 500));

    try {
      await cmd.doRun();
    } catch (e) {
      expect(doArchie).toHaveBeenCalledTimes(1);
      expect(getName).toHaveBeenCalledTimes(1);

      // @ts-ignore
      expect(cmd.prints.archivedSuccessfully).not.toHaveBeenCalled();

      expect(e.message).toEqual(msg);
      done();
    }
  });
});
