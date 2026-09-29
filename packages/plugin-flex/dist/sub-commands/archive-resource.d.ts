import FlexPlugin, { ConfigData, SecureStorage } from './flex-plugin';
interface Archivable {
    isArchived: boolean;
}
export default abstract class ArchiveResource<T extends Archivable> extends FlexPlugin {
    static topicName: string;
    static description: string;
    static flags: {
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    private prints;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
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
export {};
