export interface OClifTopic {
    description: string;
    flags: {
        [key: string]: string;
    };
    args: {
        [key: string]: string;
    };
    defaults: {
        [key: string]: string;
    };
}
export interface OclifConfig {
    name: string;
    commands: string;
    bin: string;
    devPlugins: string[];
    topics: {
        [key: string]: OClifTopic;
    };
}
/**
 * Reads the topic information from package.json
 * @param topicName the topic name to read
 */
export declare const getTopic: (topicName: string) => OClifTopic;
