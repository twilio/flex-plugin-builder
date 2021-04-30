"use strict";
/* eslint-disable import/no-unused-modules */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawn = exports.default = exports.yarn = exports.npm = exports.node = void 0;
var spawn_1 = require("./lib/spawn");
Object.defineProperty(exports, "node", { enumerable: true, get: function () { return spawn_1.node; } });
Object.defineProperty(exports, "npm", { enumerable: true, get: function () { return spawn_1.npm; } });
Object.defineProperty(exports, "yarn", { enumerable: true, get: function () { return spawn_1.yarn; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(spawn_1).default; } });
Object.defineProperty(exports, "spawn", { enumerable: true, get: function () { return spawn_1.spawn; } });
//# sourceMappingURL=index.js.map