export declare const FLEX_PACKAGES: string[];
export declare const LIST_OF_PACKAGES: string[];
export interface PackageDetail {
    name: string;
    found: boolean;
    package: {
        name?: string;
        version?: string;
    };
}
/**
 * @param packages
 */
export declare const getPackageDetails: (packages: string[]) => PackageDetail[];
