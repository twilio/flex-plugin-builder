"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarn = exports.npm = exports.node = exports.spawn = void 0;
var spawn_1 = require("./lib/spawn");
Object.defineProperty(exports, "spawn", { enumerable: true, get: function () { return __importDefault(spawn_1).default; } });
var node_1 = require("./lib/node");
Object.defineProperty(exports, "node", { enumerable: true, get: function () { return __importDefault(node_1).default; } });
var npm_1 = require("./lib/npm");
Object.defineProperty(exports, "npm", { enumerable: true, get: function () { return __importDefault(npm_1).default; } });
var yarn_1 = require("./lib/yarn");
Object.defineProperty(exports, "yarn", { enumerable: true, get: function () { return __importDefault(yarn_1).default; } });
//# sourceMappingURL=index.js.map