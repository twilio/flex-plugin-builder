import { Options } from 'yargs';
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
    static description: string;
    static flags: {
        [key: string]: Options;
    };
    private readonly parser;
    constructor(cwd?: string);
    parse: (...args: string[]) => Promise<void>;
    private init;
}
