import yargs, { Argv, Options } from 'yargs';
import { multilineString } from 'flex-dev-utils/dist/strings';

import createFlexPlugin, { FlexPluginArguments } from './create-flex-plugin';

const usage = multilineString(
  'Creates a new Twilio Flex Plugin project',
  '',
  'Arguments:',
  'name\tName of your plugin. Needs to start with plugin-',
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
}

export default class CLI {
  public static description = usage;
  public static flags: { [key: string]: Options; } = {
    typescript: {
      alias: 's',
      type: 'boolean',
      describe: 'Create a TypeScript project',
      default: false,
    },
    template: {
      alias: 't',
      type: 'string',
      describe: 'A URL to a template directory',
      default: '',
    },
    accountSid: {
      alias: 'a',
      type: 'string',
      describe: 'The Account SID for your Flex Project',
      demandOption: true,
      default: '',
    },
    runtimeUrl: {
      alias: 'r',
      type: 'boolean',
      default: false,
      describe: 'Auto-install dependencies',
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
      alias: 'h',
    },
  };
  private readonly parser: Argv<CLIArguments>;

  constructor(cwd?: string) {
    this.parser = yargs([], cwd) as Argv<CLIArguments>;

    this.init();
  }

  public parse = async (...args: string[]) => {
    const argv: CLIArguments = this.parser.parse(args[0]);
    await createFlexPlugin(argv as FlexPluginArguments);
  }

  private init = () => {
    this.parser
      .usage<any>('$0 <name>', usage, CLI.flags);
  }
}
