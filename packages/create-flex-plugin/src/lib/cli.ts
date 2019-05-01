import yargs, { Argv, Options } from 'yargs';
import createFlexPlugin, { FlexPluginArguments } from './create-flex-plugin';

const usage = [
    'Creates a new Twilio Flex Plugin project',
    '',
    'Arguments:',
    'name\tName of your plugin. Needs to start with plugin-',
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

class CLI {
    private readonly parser: Argv<CLIArguments>;
    private options: { [key: string]: Options; } = {
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

    constructor(cwd?: string) {
        this.parser = yargs([], cwd) as Argv<CLIArguments>;

        this.init();
    }

    public parse = (...args: string[]) => {
        const argv: CLIArguments = this.parser.parse(args[0]);
        createFlexPlugin(argv as FlexPluginArguments);
    }

    private init = () => {
        this.parser
            .usage<any>('$0 <name>', usage, this.options);
    }
}

export default (cwd?: string) => new CLI(cwd);
