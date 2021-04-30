import { DescribeConfiguration } from '../scripts';
import { ConfiguredPlugins } from '../scripts/describeConfiguration';
export interface Difference<T> {
    path: keyof T;
    hasDiff: boolean;
    before: unknown;
    after: unknown;
}
declare type ConfigurationKeys = Omit<DescribeConfiguration, 'plugins'>;
export declare type ConfigurationsDiff = {
    configuration: Difference<ConfigurationKeys>[];
    plugins: {
        [key: string]: Difference<ConfiguredPlugins>[];
    };
};
/**
 * Builds a diff
 * @param path  the path to the node
 * @param before  the before value
 * @param after   the after value
 */
export declare const buildDiff: <T, K extends keyof T, U extends T[K]>(path: keyof T, before: U, after: U) => Difference<T>;
/**
 * Finds diff between two {@link DescribeConfiguration}
 * @param oldConfig the old {@link DescribeConfiguration}
 * @param newConfig the new {@link DescribeConfiguration}
 */
export declare const findConfigurationsDiff: (oldConfig: DescribeConfiguration, newConfig: DescribeConfiguration) => ConfigurationsDiff;
export {};
