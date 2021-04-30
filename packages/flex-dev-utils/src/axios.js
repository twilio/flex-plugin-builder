"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settle = exports.httpAdapter = exports.MockAdapter = void 0;
/* eslint-disable import/order */
var axios_mock_adapter_1 = __importDefault(require("axios-mock-adapter"));
exports.MockAdapter = axios_mock_adapter_1.default;
var axios_1 = __importDefault(require("axios"));
// @ts-ignore
var http_1 = __importDefault(require("axios/lib/adapters/http"));
exports.httpAdapter = http_1.default;
// @ts-ignore
var settle_1 = __importDefault(require("axios/lib/core/settle"));
exports.settle = settle_1.default;
exports.default = axios_1.default;
//# sourceMappingURL=axios.js.map