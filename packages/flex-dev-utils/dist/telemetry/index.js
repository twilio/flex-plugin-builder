"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_PREFIX = exports.TRACK_EVENT_NAME = exports.Telemetry = void 0;
var telemetry_1 = require("./lib/telemetry");
Object.defineProperty(exports, "Telemetry", { enumerable: true, get: function () { return __importDefault(telemetry_1).default; } });
var constants_1 = require("./lib/constants");
Object.defineProperty(exports, "TRACK_EVENT_NAME", { enumerable: true, get: function () { return constants_1.TRACK_EVENT_NAME; } });
Object.defineProperty(exports, "COMMAND_PREFIX", { enumerable: true, get: function () { return constants_1.COMMAND_PREFIX; } });
//# sourceMappingURL=index.js.map