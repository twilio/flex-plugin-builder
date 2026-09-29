export declare type Callback<R> = () => Promise<R>;
interface Progress {
    start: () => void;
    succeed: () => void;
    fail: (text?: string) => void;
}
/**
 * Added for testing purposes
 * @param title
 * @param disabled
 */
export declare const _getSpinner: (text: string, disabled: boolean) => Progress;
/**
 * An {@link ora} progress wrapper
 *
 * @param title   the title to show
 * @param action  the callback to run
 * @param disabled force enable the progress
 */
export declare const progress: <R>(title: string, action: Callback<R>, disabled?: boolean) => Promise<R>;
export default progress;
