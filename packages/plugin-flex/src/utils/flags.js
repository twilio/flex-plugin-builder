"use strict";
/**
 * OClif flag pass everything you pass to its constructor down, we just don't have the type definition
 * This file is where we can add custom type definition such as max/min so we can use it
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enum = exports.boolean = exports.string = void 0;
var command_1 = require("@oclif/command");
var flags = __assign({}, command_1.flags);
var string = flags.string;
exports.string = string;
exports.boolean = flags.boolean;
var _enum = flags.enum;
exports.enum = _enum;
//# sourceMappingURL=flags.js.map