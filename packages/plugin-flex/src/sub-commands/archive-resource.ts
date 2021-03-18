import { TwilioApiError, confirm } from 'flex-dev-utils';

import FlexPlugin, { ConfigData, SecureStorage } from './flex-plugin';
import { createDescription, instanceOf } from '../utils/general';

interface Archivable {
  isArchived: boolean;
}

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

export default abstract class ArchiveResource<T extends Archivable> extends FlexPlugin {
  static topicName = 'flex:plugins:archive';

  static description = createDescription(ArchiveResource.topic.description, true);

  static flags = {
    ...baseFlags,
  };

  // @ts-ignore
  private prints;

  public constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
    this.prints = this._prints.archiveResource;
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    const name = `**${this.getName()}**`;
    const doArchive = await confirm(
      `Are you sure you want to archive ${this.getResourceType()} ${this.getName()}? Once archived, it cannot be undone.`,
      'N',
    );
    if (!doArchive) {
      this.exit(0);
      return;
    }

    try {
      const result = await this.doArchive();
      if (result.isArchived) {
        this.prints.archivedSuccessfully(name);
      } else {
        this.prints.archivedFailed(name);
      }
    } catch (e) {
      if (instanceOf(e, TwilioApiError) && e.status === 400) {
        this.prints.alreadyArchived(name, e.message);
      } else {
        throw e;
      }
    }
  }

  /**
   * Calls the archive endpoint
   */
  abstract doArchive(): Promise<T>;

  /**
   * Returns the identifier name
   */
  abstract getName(): string;

  abstract getResourceType(): string;
}
