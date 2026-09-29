import inquirer from 'inquirer';
export declare type YNAnswer = 'Y' | 'N';
export declare const positiveAnswers: string[];
export declare const negativeAnswers: string[];
export declare const acceptableAnswers: string[];
export interface Question {
    name: string;
    message: string;
    type?: 'list' | 'input' | 'password';
    validate?(input: string): boolean | string | Promise<boolean | string>;
}
/**
 * Confirmation validator
 *
 * @param defaultAnswer
 */
export declare const _validateConfirmation: (defaultAnswer?: YNAnswer | undefined) => (input: string) => string | boolean;
/**
 * Prompts the user to answer the question. Upon validation, returns the answer.
 *
 * @param question  the question to prompt the user with
 */
export declare const prompt: (question: Question) => Promise<Question['name']>;
/**
 * Provides a confirmation prompt. The response is a Promise<boolean> with `true` resolving to
 * successful confirmation, and `false` being the rejected confirmation
 *
 * @param question      the question to ask
 * @param defaultAnswer the default answer, can be Y or N
 */
export declare const confirm: (question: string, defaultAnswer?: YNAnswer | undefined) => Promise<boolean>;
/**
 * Prompts the user to select from one of the choices.
 *
 * @param question  the question to prompt the user with
 * @param choices   the list of options
 */
export declare const choose: (question: Question, choices: string[]) => Promise<Question['name']>;
export default inquirer;
