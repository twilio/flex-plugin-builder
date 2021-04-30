"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("flex-dev-utils/dist/fs");
/**
 * Main method for generating a default Jest configuration
 */
exports.default = (function () {
    return {
        rootDir: fs_1.getPaths().cwd,
        preset: path_1.join(require.resolve('flex-plugin-test'), '..', '..'),
    };
});
//# sourceMappingURL=jest.config.js.map