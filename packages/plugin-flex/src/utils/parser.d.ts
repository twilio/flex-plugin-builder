import * as Parser from '@oclif/parser';
declare type Input<F> = Parser.Input<F>;
declare type Output<F, A> = Parser.Output<F, A>;
/**
 * Trims the object
 * @param obj
 * @private
 */
export declare const _trim: <F>(obj: F) => F;
/**
 * Validates the flags
 * @param flags
 * @param options
 * @param parse
 * @private
 */
export declare const _validate: <F, A>(flags: F, options: Parser.flags.Input<F>, parse?: Output<F, A> | undefined) => void;
/**
 * Prepares the options for parsing
 * @param options
 */
export declare const _prepareFlags: <F>(options?: Input<F> | undefined) => Input<F> | undefined;
/**
 * Combines the alias flags
 */
export declare const _combineFlags: <F, A extends {
    [name: string]: any;
}>(parsed: Output<F, A>, options?: Input<F> | undefined) => Output<F, A>;
/**
 * Extends the parsing of OClif by adding support for empty/min/max
 * @param OclifParser the original parser from the command
 */
declare const parser: <F, A extends {
    [name: string]: any;
}>(OclifParser: (options?: Input<F> | undefined, argv?: string[] | undefined) => Output<F, A>) => (options?: Input<F> | undefined, argv?: string[]) => Output<F, A>;
export default parser;
