import chalk from 'chalk';
interface ColumnsOptions {
    indent?: boolean;
}
export declare type LogLevels = 'debug' | 'info' | 'warning' | 'error' | 'trace' | 'success';
interface LoggerOptions {
    isQuiet?: boolean;
    isDebug?: boolean;
    isTrace?: boolean;
    markdown?: boolean;
}
export declare const coloredStrings: {
    dim: chalk.Chalk;
    bold: chalk.Chalk;
    italic: chalk.Chalk;
    code: chalk.Chalk;
    link: chalk.Chalk;
    info: chalk.Chalk;
    success: chalk.Chalk;
    warning: chalk.Chalk;
    error: chalk.Chalk;
    headline: chalk.Chalk;
    name: chalk.Chalk;
    digit: chalk.Chalk;
    underline: chalk.Chalk;
};
/**
 * The Logger class
 */
export declare class Logger {
    private static formatter;
    private readonly options;
    constructor(options?: LoggerOptions);
    /**
     * simple log without markdown
     * @param args
     */
    log: (...args: any[]) => void;
    /**
     * debug level log
     * @param args
     */
    debug: (...args: any[]) => void;
    /**
     * trace level trace
     * @param args
     */
    trace: (...args: any[]) => void;
    /**
     * info level log
     * @param args
     */
    info: (...args: any[]) => void;
    /**
     * success level log
     * @param args
     */
    success: (...args: any[]) => void;
    /**
     * error level log
     * @param args
     */
    error: (...args: any[]) => void;
    /**
     * warning level log
     * @param args
     */
    warning: (...args: any[]) => void;
    /**
     * Notice log is info level with a magenta color
     * @param args
     */
    notice: (...args: any[]) => void;
    /**
     * Simple wrapper for column printing
     * @param lines
     * @param options
     */
    columns: (lines: string[][], options?: ColumnsOptions | undefined) => void;
    /**
     * Appends new line
     * @param lines the number of lines to append
     */
    newline: (lines?: number) => void;
    /**
     * A wrapper for showing bash command information such as `npm install foo`
     * @param command the bash command
     * @param args  the remaining arguments
     */
    installInfo: (command: string, ...args: string[]) => void;
    /**
     * Clears the terminal either if forced is provided, or if persist_terminal env is not set
     */
    clearTerminal: (forced?: boolean) => void;
    /**
     * Provides basic markdown support. Currently supported bold **bold** and italic _italic_
     * @param msg
     */
    markdown: (msg?: string | undefined) => string | undefined;
    /**
     * The internal logger method
     * @param args
     * @private
     */
    private _log;
    /**
     * Checks whether the logger is set for debug mode
     */
    private isDebug;
    /**
     * Checks whether the logger is set for trace mode
     */
    private isTrace;
    private isQuiet;
}
/**
 * The default logger will use environment variables to determine behavior.
 * You can create an instance to overwrite default behavior.
 */
export declare const _logger: Logger;
declare const _default: {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warning: (...args: any[]) => void;
    error: (...args: any[]) => void;
    trace: (...args: any[]) => void;
    success: (...args: any[]) => void;
    newline: (lines?: number) => void;
    notice: (...args: any[]) => void;
    installInfo: (command: string, ...args: string[]) => void;
    clearTerminal: (forced?: boolean) => void;
    markdown: (msg?: string | undefined) => string | undefined;
    wrap: (input: string, columns: number, options?: {
        hard: boolean;
    }) => string;
    columns: (lines: string[][], options?: ColumnsOptions | undefined) => void;
    colors: chalk.Chalk & chalk.ChalkFunction & {
        supportsColor: false | chalk.ColorSupport;
        Level: chalk.Level;
        Color: ("red" | "yellow" | "green" | "cyan" | "magenta" | "black" | "blue" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright") | ("bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright");
        ForegroundColor: "red" | "yellow" | "green" | "cyan" | "magenta" | "black" | "blue" | "white" | "gray" | "grey" | "blackBright" | "redBright" | "greenBright" | "yellowBright" | "blueBright" | "magentaBright" | "cyanBright" | "whiteBright";
        BackgroundColor: "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBlackBright" | "bgRedBright" | "bgGreenBright" | "bgYellowBright" | "bgBlueBright" | "bgMagentaBright" | "bgCyanBright" | "bgWhiteBright";
        Modifiers: "dim" | "bold" | "reset" | "italic" | "underline" | "inverse" | "hidden" | "strikethrough" | "visible";
        stderr: chalk.Chalk & {
            supportsColor: false | chalk.ColorSupport;
        };
    };
    coloredStrings: {
        dim: chalk.Chalk;
        bold: chalk.Chalk;
        italic: chalk.Chalk;
        code: chalk.Chalk;
        link: chalk.Chalk;
        info: chalk.Chalk;
        success: chalk.Chalk;
        warning: chalk.Chalk;
        error: chalk.Chalk;
        headline: chalk.Chalk;
        name: chalk.Chalk;
        digit: chalk.Chalk;
        underline: chalk.Chalk;
    };
    linkText: (text: string, url: string) => string;
    log: (...args: any[]) => void;
};
export default _default;
