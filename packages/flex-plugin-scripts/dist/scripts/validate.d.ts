/**
 * Builds the bundle
 */
declare const validate: (...argv: string[]) => Promise<{
    violations: string[];
    vtime: number;
    error?: {
        message: string;
        timedOut: boolean;
    };
}>;
export default validate;
