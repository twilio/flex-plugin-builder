import semver, { ReleaseType, SemVer } from 'semver';

export default semver;

// eslint-disable-next-line import/no-unused-modules
export { ReleaseType, SemVer };

/**
 * Checks whether the provided version satisfies the given range. The provided version is coerced first
 * @param version the version to test
 * @param range the range to check
 */
export const versionSatisfiesRange = (version: string, range: string): boolean => {
  return semver.satisfies(semver.coerce(version)?.version as string, range);
};
