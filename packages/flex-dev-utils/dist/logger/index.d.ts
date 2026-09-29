declare const boxen: {
    error: (msg: string, showSymbol?: boolean) => void;
    warning: (msg: string, showSymbol?: boolean) => void;
    info: (msg: string, showSymbol?: boolean) => void;
    print: (level: import("./lib/logger").LogLevels, msg: string) => void;
};
export { Logger, coloredStrings } from './lib/logger';
export { default as chalk } from 'chalk';
export { default as logger } from './lib/logger';
export { default as strings, multilineString, singleLineString } from './lib/strings';
export { default as table, printArray, printObjectArray } from './lib/table';
export { default as columnify } from './lib/columnify';
export { boxen };
