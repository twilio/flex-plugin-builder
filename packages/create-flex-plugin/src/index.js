"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFlexPlugin = exports.default = void 0;
/* eslint-disable import/no-unused-modules */
var updateNotifier_1 = require("flex-dev-utils/dist/updateNotifier");
updateNotifier_1.checkForUpdate();
var cli_1 = require("./lib/cli");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(cli_1).default; } });
var create_flex_plugin_1 = require("./lib/create-flex-plugin");
Object.defineProperty(exports, "CreateFlexPlugin", { enumerable: true, get: function () { return __importDefault(create_flex_plugin_1).default; } });
//# sourceMappingURL=index.js.map