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
  });
});
