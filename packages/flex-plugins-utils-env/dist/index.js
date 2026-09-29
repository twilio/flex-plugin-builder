"use strict";
/* eslint-disable import/no-unused-modules */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lifecycle = exports.Environment = exports.env = exports.default = void 0;
var env_1 = require("./lib/env");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(env_1).default; } });
Object.defineProperty(exports, "env", { enumerable: true, get: function () { return __importDefault(env_1).default; } });
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return env_1.Environment; } });
Object.defineProperty(exports, "Lifecycle", { enumerable: true, get: function () { return env_1.Lifecycle; } });
//# sourceMappingURL=index.js.map