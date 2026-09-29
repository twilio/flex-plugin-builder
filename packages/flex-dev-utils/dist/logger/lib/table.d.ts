/**
 * Checks that the matrix's rows all have the same number of entries
 *
 * @param matrix
 */
export declare const isRegularMatrix: (matrix: string[][]) => boolean;
/**
 * Prints the data in a table format with the provided headers
 *
 * @param header  the header of the table
 * @param data    the data entry to print
 */
export declare const printArray: (header: string[], data: string[][]) => void;
/**
 * Prints the data in a table format with the provided headers.
 *
 * @param data    the data entry to print
 */
export declare const printObjectArray: (data: object[]) => void;
declare const _default: {
    isRegularMatrix: (matrix: string[][]) => boolean;
    printArray: (header: string[], data: string[][]) => void;
    printObjectArray: (data: object[]) => void;
};
export default _default;
