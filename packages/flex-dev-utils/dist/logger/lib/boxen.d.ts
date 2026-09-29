import boxen from 'boxen';
import { LogLevels } from './logger';
export default boxen;
/**
 * Prints the message inside a box
 *
 * @param level   the log level to display the message as
 * @param msg     the message
 */
export declare const print: (level: LogLevels, msg: string) => void;
/**
 * Displays the message as a warning box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in a warning symbol
 */
export declare const warning: (msg: string, showSymbol?: boolean) => void;
/**
 * Displays the message as an info box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in an info symbol
 */
export declare const info: (msg: string, showSymbol?: boolean) => void;
/**
 * Displays the message as am error box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in an error symbol
 */
export declare const error: (msg: string, showSymbol?: boolean) => void;
/**
 * Displays the message as a success box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in a success symbol
 */
export declare const success: (msg: string, showSymbol?: boolean) => void;
