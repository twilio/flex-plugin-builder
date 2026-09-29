"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Exits unless --no-process-exit flag is provided
 *
 * @param exitCode  the exitCode
 * @param args      the process argument
 */
var exit = function (exitCode, args) {
    if (args === void 0) { args = []; }
    // Exit if not an embedded script
    if (!args.includes('--no-process-exit')) {
        // eslint-disable-next-line no-process-exit
        process.exit(exitCode);
    }
};
exports.default = exit;
//# sourceMappingURL=exit.js.map