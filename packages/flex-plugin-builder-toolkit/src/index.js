"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = exports.build = exports.start = void 0;
var start_1 = require("./scripts/start");
Object.defineProperty(exports, "start", { enumerable: true, get: function () { return __importDefault(start_1).default; } });
var build_1 = require("./scripts/build");
Object.defineProperty(exports, "build", { enumerable: true, get: function () { return __importDefault(build_1).default; } });
var deploy_1 = require("./scripts/deploy");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return __importDefault(deploy_1).default; } });
//# sourceMappingURL=index.js.map