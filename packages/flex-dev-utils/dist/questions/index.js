"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.choose = exports.prompt = exports.confirm = exports.inquirer = void 0;
var inquirer_1 = require("./lib/inquirer");
Object.defineProperty(exports, "inquirer", { enumerable: true, get: function () { return __importDefault(inquirer_1).default; } });
Object.defineProperty(exports, "confirm", { enumerable: true, get: function () { return inquirer_1.confirm; } });
Object.defineProperty(exports, "prompt", { enumerable: true, get: function () { return inquirer_1.prompt; } });
Object.defineProperty(exports, "choose", { enumerable: true, get: function () { return inquirer_1.choose; } });
//# sourceMappingURL=index.js.map