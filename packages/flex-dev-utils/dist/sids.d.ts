declare type Null = null | undefined;
/**
 * Validates the string is a valid sid
 *
 * @param sid the sid
 */
export declare const isValidSid: (sid: string | Null) => boolean;
/**
 * Checks if the provided string is of type Sid
 * @param sid the sid to check
 */
export declare const looksLikeSid: (sid: string) => boolean;
/**
 * Validates sid is of type prefix provided
 *
 * @param sid     the sid
 * @param prefix  the prefix of the sid
 */
export declare const isSidOfType: (sid: string | Null, prefix: string | Null) => boolean;
/**
 * Prefix of Sids
 */
export declare const SidPrefix: {
    AccountSid: string;
    ApiKey: string;
    ServiceSid: string;
    EnvironmentSid: string;
    BuildSid: string;
    FileSid: string;
    VersionSid: string;
    DeploymentSid: string;
};
declare const _default: {
    isValidSid: (sid: string | Null) => boolean;
    isSidOfType: (sid: string | Null, prefix: string | Null) => boolean;
    looksLikeSid: (sid: string) => boolean;
    SidPrefix: {
        AccountSid: string;
        ApiKey: string;
        ServiceSid: string;
        EnvironmentSid: string;
        BuildSid: string;
        FileSid: string;
        VersionSid: string;
        DeploymentSid: string;
    };
};
export default _default;
