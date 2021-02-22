import { TwilioApiError } from 'flex-dev-utils';

import FlexPlugin, { ConfigData, SecureStorage } from './flex-plugin';
import { instanceOf } from '../utils/general';

interface Archivable {
  isArchived: boolean;
}

export default abstract class ArchiveResource<T extends Archivable> extends FlexPlugin {
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
    const name = this.getName();

    try {
      const result = await this.doArchive();
      if (result.isArchived) {
        this.prints.archivedSuccessfully(name);
      } else {
        this.prints.archivedFailed(name);
      }
    } catch (e) {
      if (instanceOf(e, TwilioApiError) && e.status === 400) {
        this.prints.alreadyArchived(name);
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
}
