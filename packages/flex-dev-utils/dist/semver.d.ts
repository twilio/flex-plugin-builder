import semver, { ReleaseType, SemVer } from 'semver';
export default semver;
export { ReleaseType, SemVer };
/**
 * Checks whether the provided version satisfies the given range. The provided version is coerced first
 * @param version the version to test
 * @param range the range to check
 */
export declare const versionSatisfiesRange: (version: string, range: string) => boolean;
