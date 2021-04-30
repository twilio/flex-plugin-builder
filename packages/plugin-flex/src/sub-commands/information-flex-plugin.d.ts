import FlexPlugin, { ConfigData, SecureStorage } from './flex-plugin';
interface IsActive {
    isActive: boolean;
}
/**
 * A helper class for the describe/list methods
 */
export default abstract class InformationFlexPlugin<T> extends FlexPlugin {
    static flags: {
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<T | null>;
    /**
     * Sorts an array of resource by its isActive property
     * @param list  the list to sort
     */
    sortByActive<A extends IsActive>(list: A[]): A[];
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
export {};
