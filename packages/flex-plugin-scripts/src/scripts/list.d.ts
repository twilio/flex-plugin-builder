import { Visibility } from '../clients/serverless-types';
export declare type Order = 'desc' | 'asc';
/**
 * Lists all versions of this plugin
 *
 * @param visibilities  the visibility of the version to show. This can be Public, Private or Both
 * @param order         the order of versions. This can be desc or asc
 * @private
 */
export declare const _doList: (visibilities: Visibility[], order?: Order) => Promise<void>;
/**
 * Checks the process argument and calls the {@link _doList}
 *
 * @param argv
 */
declare const list: (...argv: string[]) => Promise<void>;
export default list;
