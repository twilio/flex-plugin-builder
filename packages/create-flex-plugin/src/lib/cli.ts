import yargs, { Argv, Options } from 'yargs';
import { runner, exit, multilineString, FlexPluginError } from '@twilio/flex-dev-utils';

import { FlexPluginArguments, createFlexPlugin } from './create-flex-plugin';

const usage = multilineString(
  'Creates a new Twilio Flex Plugin project',
  '',
  'Arguments:',
  'name\tName of your plugin.',
);

export const FLEX_UI_1_EOL = multilineString(
  'Flex UI 1.x has reached end of life and plugins can no longer be created for it.',
  'New plugins target Flex UI 2.',
  '',
  'To migrate an existing Flex UI 1 plugin, run:',
  '  twilio flex:plugins:upgrade-plugin',
);

export interface CLIArguments {
  accountSid?: string;
  a?: string;
  runtimeUrl?: string;
  r?: string;
  install?: boolean;
  i?: boolean;
  name?: string;
  yarn?: boolean;
  y?: boolean;
  template?: string;
  t?: string;
  typescript?: boolean;
  s?: boolean;
  flexui2?: boolean;
  flexui1?: boolean;
}

/**
 * Rejects Flex UI 1.x, which is end of life. `argv` is optional because yargs
 * returns undefined when it exits on a validation failure.
 */
export const assertFlexUiSupported = (argv?: CLIArguments): void => {
  if (argv?.flexui1) {
    throw new FlexPluginError(FLEX_UI_1_EOL);
  }
};

export default class CLI {
  public static description = usage;

  public static flags: { [key: string]: Options } = {
    typescript: {
      alias: 's',
      type: 'boolean',
      describe: 'Create a TypeScript project',
      default: false,
    },
    template: {
      alias: 't',
      type: 'string',
      describe: 'A GitHub URL that contains your template',
      default: '',
    },
    accountSid: {
      alias: 'a',
      type: 'string',
      describe: 'The Account SID for your Flex Project',
      default: '',
    },
    runtimeUrl: {
      alias: 'r',
      type: 'boolean',
      default: false,
      describe: 'The URL to your Twilio Flex Runtime',
    },
    install: {
      alias: 'i',
      type: 'boolean',
      default: false,
      describe: 'Auto-install dependencies',
    },
    yarn: {
      alias: 'y',
      type: 'boolean',
      default: false,
      describe: 'Use yarn as your dependency manager',
    },
    help: {
      alias: 'h',
      description: usage,
    },
    version: {
      alias: 'v',
    },
    /*
     * Still registered so that `--flexui1` fails with the message below rather than
     * yargs' generic "Unknown argument"; Flex UI 1 is EOL and cannot be scaffolded.
     */
    flexui1: {
      type: 'boolean',
      describe: 'No longer supported - Flex UI 1.x is end of life',
    },
    flexui2: {
      type: 'boolean',
      describe: 'Creates a plugin compatible with Flex UI major version 2.0 (the only supported version)',
    },
  };

  private readonly parser: Argv<CLIArguments>;

  constructor(cwd?: string) {
    this.parser = yargs([], cwd) as Argv<CLIArguments>;

    this.init();
  }

  public parse = async (...args: string[]): Promise<void> => {
    const argv: CLIArguments = this.parser.parse(args);

    await runner(async () => {
      assertFlexUiSupported(argv);

      return createFlexPlugin(argv as FlexPluginArguments);
    });
    exit(0);
  };

  private init = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.parser.usage<any>('$0 <name>', usage, CLI.flags);
  };
}
