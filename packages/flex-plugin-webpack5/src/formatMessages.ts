import webpackFormatMessages from '@k88/format-webpack-messages';

/**
 * A compile error or warning. Webpack 4 reported these as strings, webpack 5 reports objects
 * (StatsError / WebpackError), and the TypeScript checker reports strings.
 */
interface CompilerMessageObject {
  [key: string]: unknown;
  message?: string;
  moduleName?: string;
  file?: string;
  loc?: string;
}
export type CompilerMessage = string | CompilerMessageObject;

/**
 * Turns a compile error or warning into the string `@k88/format-webpack-messages` expects.
 * That formatter calls `message.split`, which throws on anything that is not a string.
 * @param message the error or warning
 */
export const toMessageString = (message: CompilerMessage | null | undefined): string => {
  if (typeof message === 'string') {
    return message;
  }
  if (!message || typeof message !== 'object') {
    return String(message ?? '');
  }

  const origin = message.moduleName || message.file;
  const location = origin && message.loc ? `${origin}:${message.loc}` : origin;
  const text = typeof message.message === 'string' ? message.message : String(message);

  return location ? `${location}\n${text}` : text;
};

/**
 * Formats compile errors and warnings for printing, whatever form webpack reported them in
 * @param errors   the errors
 * @param warnings the warnings
 */
export const formatMessages = (
  errors: CompilerMessage[] = [],
  warnings: CompilerMessage[] = [],
): { errors: string[]; warnings: string[] } =>
  webpackFormatMessages({
    errors: errors.map(toMessageString),
    warnings: warnings.map(toMessageString),
  });
