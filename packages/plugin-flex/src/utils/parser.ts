import * as Parser from '@oclif/parser';
import { CLIParseError } from '@oclif/parser/lib/errors';

type Input<F> = Parser.Input<F>;
type Output<F, A> = Parser.Output<F, A>;

/**
 * Trims the object
 * @param obj
 * @private
 */
export const _trim = <F>(obj: F): F => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  });

  return obj;
};

/**
 * Validates the flags
 * @param flags
 * @param options
 * @param parse
 * @private
 */
export const _validate = <F, A>(flags: F, options: Parser.flags.Input<F>, parse?: Output<F, A>): void => {
  Object.keys(flags).forEach((flag) => {
    const option = options[flag];
    const input = flags[flag];
    const cliErrorOption = {
      parse: {
        input: option,
        output: parse,
      },
      message: '',
    };

    if (typeof input !== 'string' || !option) {
      return;
    }

    if (input === '' && option.required) {
      cliErrorOption.message = `Flag --${flag}=${input} cannot be empty`;
      throw new CLIParseError(cliErrorOption);
    }
    if ('min' in option && input.length < option.min) {
      cliErrorOption.message = `Flag --${flag}=${input} must be at least ${option.min} characters long`;
      throw new CLIParseError(cliErrorOption);
    }
    if ('max' in option && input.length > option.max) {
      cliErrorOption.message = `Flag --${flag}=${input} cannot be longer than ${option.max} characters`;
      throw new CLIParseError(cliErrorOption);
    }
  });
};

/**
 * Extends the parsing of OClif by adding support for empty/min/max
 * @param OclifParser the original parser from the command
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parser = <F, A extends { [name: string]: any }>(
  OclifParser: (options?: Input<F>, argv?: string[]) => Output<F, A>,
) => (options?: Input<F>, argv: string[] = []): Output<F, A> => {
  const parse = OclifParser(options, argv);

  parse.flags = _trim(parse.flags);
  parse.args = _trim(parse.args);
  if (options && options.flags && parse.flags) {
    _validate(parse.flags, options.flags, parse);
  }

  return parse as Output<F, A>;
};

export default parser;
