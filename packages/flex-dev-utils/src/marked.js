"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
var marked_1 = __importDefault(require("marked"));
var marked_terminal_1 = __importDefault(require("marked-terminal"));
var pipe_compose_1 = require("@k88/pipe-compose");
var fs_1 = require("./fs");
var logger_1 = __importDefault(require("./logger"));
marked_1.default.setOptions({
    renderer: new marked_terminal_1.default(),
});
/**
 * Renders the markdown file
 *
 * @param filePath  path to markdown file
 */
// eslint-disable-next-line import/no-unused-modules
var render = function (filePath) { return pipe_compose_1.pipe(filePath, fs_1.readFileSync, marked_1.default, logger_1.default.info); };
exports.render = render;
// eslint-disable-next-line import/no-unused-modules
exports.default = marked_1.default;
//# sourceMappingURL=marked.js.map