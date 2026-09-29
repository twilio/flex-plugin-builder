import packageJson from 'package-json';
export declare type Tag = 'latest' | 'beta' | 'alpha';
/**
 * Fetches the version corresponding to the dependency inside the flex-ui package.json
 * @param name the package to check
 */
export default function getRegistryVersion(module: string, tag?: Tag): Promise<packageJson.AbbreviatedMetadata>;
