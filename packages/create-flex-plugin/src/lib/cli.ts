import yargs, { Arguments, Options } from 'yargs';
import { multilineString } from 'flex-dev-utils/dist/strings';
import { runner } from 'flex-dev-utils';

import createFlexPlugin from './create-flex-plugin';

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
  public static TSTemplate = 'https://github.com/twilio/flex-plugin-ts';
  public static JSTemplate = 'https://github.com/twilio/flex-plugin-js';
  public static description = multilineString(
    'Creates a new Twilio Flex Plugin project',
    '',
    'Arguments:',
    'name\tName of your plugin. Needs to start with plugin-',
  );

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
      description: CLI.description,
    },
    version: {
      alias: 'v',
    },
  };

  public parse = async (...args: string[]) => {
    const argv = yargs
      .options(CLI.flags)
      .usage('$0 <name>', CLI.description, CLI.flags)
      .parse(args) as Arguments<CLIArguments>;
    if (!argv.template) {
      argv.template = argv.typescript ? CLI.TSTemplate : CLI.JSTemplate;
    }

    await runner(async () => await createFlexPlugin(argv));
    return process.exit(0);
  }
}
