import * as Parser from '@oclif/parser';
import { CLIParseError } from '@oclif/parser/lib/errors';

import { IOptionFlag } from './flags';

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

    if (!option) {
      return;
    }

    if (input === '' && option.required) {
      cliErrorOption.message = `Flag --${flag}=${input} cannot be empty`;
      throw new CLIParseError(cliErrorOption);
    }
    if ('min' in option && typeof input === 'string' && input.length < option.min) {
      cliErrorOption.message = `Flag --${flag}=${input} must be at least ${option.min} characters long`;
      throw new CLIParseError(cliErrorOption);
    }
    if ('max' in option && typeof input === 'string' && input.length > option.max) {
      cliErrorOption.message = `Flag --${flag}=${input} cannot be longer than ${option.max} characters`;
      throw new CLIParseError(cliErrorOption);
    }
  });
};

/**
 * Prepares the options for parsing
 * @param options
 */
export const _prepareFlags = <F>(options?: Input<F>) => {
  if (!options) {
    return options;
  }

  // @ts-ignore
  Object.entries(options.flags).forEach((entry: [string, IOptionFlag<F>]) => {
    if (entry[1].alias) {
      // @ts-ignore
      options.flags[entry[1].alias] = { ...entry[1] };
    }
  });
  return options;
};

/**
 * Combines the alias flags
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _combineFlags = <F, A extends { [name: string]: any }>(
  parsed: Output<F, A>,
  options?: Input<F>,
): Output<F, A> => {
  if (!options) {
    return parsed;
  }

  // @ts-ignore
  Object.entries(options.flags).forEach((entry: [string, IOptionFlag<F>]) => {
    /*
     * Append the 'alias' to the actual (non-alias) flag
     * That check is entry[0] !== entry[1].alias (i.e. the alias option and the flag name are not the same)
     */
    if (entry[1].alias && entry[0] !== entry[1].alias && parsed.flags[entry[1].alias]) {
      if (parsed.flags[entry[0]]) {
        parsed.flags[entry[0]].push(...parsed.flags[entry[1].alias]);
      } else {
        parsed.flags[entry[0]] = [...parsed.flags[entry[1].alias]];
      }
    }
  });

  // @ts-ignore
  Object.entries(options.flags).forEach((entry: [string, IOptionFlag<F>]) => {
    if (entry[1].alias && entry[0] === entry[1].alias) {
      delete parsed.flags[entry[0]];
    }
  });

  return parsed;
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
  const parsed: Output<F, A> = _combineFlags(OclifParser(_prepareFlags(options), argv), options);

  parsed.flags = _trim(parsed.flags);
  parsed.args = _trim(parsed.args);

  if (options && options.flags && parsed.flags) {
    _validate(parsed.flags, options.flags, parsed);
  }

  return parsed;
};

export default parser;
