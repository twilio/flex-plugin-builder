import yargs, { Argv, Options } from 'yargs';
import createFlexPlugin, { FlexPluginArguments } from './create-flex-plugin';

const usage = [
    'Creates a new Twilio Flex Plugin project',
    '',
    'Arguments:',
    'name\tName of your plugin. Needs to start with plugin-'
].join('\r\n');

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
}

class cli {
  private readonly parser: Argv<CLIArguments>;
  private options: {[key: string]: Options;} = {
    accountSid: {
      alias: 'a',
      describe: 'The Account SID for your Flex Project',
      default: null,
    },
    runtimeUrl: {
      alias: 'a',
      type: 'boolean',
      default: false,
      describe: 'Auto-install dependencies'
    },
    install: {
      alias: 'i',
      type: 'boolean',
      default: false,
      describe: 'Auto-install dependencies'
    },
    yarn: {
      alias: 'y',
      type: 'boolean',
      default: false,
      describe: 'Use yarn as your dependency manager',
    },
    help: {
      alias: 'h',
      description: usage
    },
    version: {
      alias: 'h'
    }
  };

  constructor(cwd) {
    this.parser = yargs([], cwd);

    this.init();
  }

  init() {
    this.parser
        .usage<any>('$0 <name>', usage, this.options);
  }

  public parse = (...args) => {
    const argv: CLIArguments = this.parser.parse(args[0]);
    createFlexPlugin(argv as FlexPluginArguments);
  }
}

export default cwd => new cli(cwd);
