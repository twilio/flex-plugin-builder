/**
 * Returns the latest flex ui version for a given major
 * Will search through latest, beta, and alpha versions for a matching verion (in that order)
 * @param version the flex ui major version
 */
export default function getLatestFlexUIVersion(majorVersion: 1 | 2 | 3 | 4): Promise<string>;
