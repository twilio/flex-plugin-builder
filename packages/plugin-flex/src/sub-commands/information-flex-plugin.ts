import { TwilioApiError } from 'flex-plugins-utils-exception';

import FlexPlugin, { ConfigData, SecureStorage } from './flex-plugin';

interface IsActive {
  isActive: boolean;
}

/**
 * A helper class for the describe/list methods
 */
export default abstract class InformationFlexPlugin<T> extends FlexPlugin {
  static flags = {
    ...FlexPlugin.flags,
  };

  public constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });

    this.scriptArgs = [];
  }

  /**
   * @override
   */
  async doRun() {
    try {
      const resource = await this.getResource();
      if (this.isJson) {
        return resource;
      }

      this.print(resource);
    } catch (e) {
      if (e.instanceOf && e.instanceOf(TwilioApiError)) {
        if ((e as TwilioApiError).status === 404) {
          this.notFound();
          this.exit(1);
          return null;
        }
      }

      throw e;
    }

    return null;
  }

  /**
   * Sorts an array of resource by its isActive property
   * @param list  the list to sort
   */
  sortByActive<A extends IsActive>(list: A[]) {
    const active = list.find((r) => r.isActive);
    const inactive = list.filter((r) => !r.isActive);
    const sorted = [...inactive];
    if (active) {
      sorted.unshift(active);
    }

    return sorted;
  }

  /**
   * Print when the resource is not found
   * @abstract
   */
  abstract notFound(): void;

  /**
   * Fetches the resource
   * @abstract
   */
  abstract getResource(): Promise<T>;

  /**
   * Prints the information on the resource
   * @abstract
   * @param resource
   */
  abstract print(resource: T): void;
}
