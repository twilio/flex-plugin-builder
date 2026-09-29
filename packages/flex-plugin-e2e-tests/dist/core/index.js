"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runner = exports.testSuites = exports.homeDir = exports.testParams = exports.testScenarios = void 0;
/* eslint-disable import/no-unused-modules */
var parameters_1 = require("./parameters");
Object.defineProperty(exports, "testScenarios", { enumerable: true, get: function () { return parameters_1.testScenarios; } });
Object.defineProperty(exports, "testParams", { enumerable: true, get: function () { return parameters_1.testParams; } });
Object.defineProperty(exports, "homeDir", { enumerable: true, get: function () { return parameters_1.homeDir; } });
var suites_1 = require("./suites");
Object.defineProperty(exports, "testSuites", { enumerable: true, get: function () { return suites_1.testSuites; } });
var runner_1 = require("./runner");
Object.defineProperty(exports, "runner", { enumerable: true, get: function () { return __importDefault(runner_1).default; } });
//# sourceMappingURL=index.js.map