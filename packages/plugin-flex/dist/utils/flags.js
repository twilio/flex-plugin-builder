"use strict";
/**
 * OClif flag pass everything you pass to its constructor down, we just don't have the type definition
 * This file is where we can add custom type definition such as max/min so we can use it
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enum = exports.boolean = exports.string = void 0;
const command_1 = require("@oclif/command");
const flags = Object.assign({}, command_1.flags);
const string = flags.string;
exports.string = string;
exports.boolean = flags.boolean;
const _enum = flags.enum;
exports.enum = _enum;
//# sourceMappingURL=flags.js.map