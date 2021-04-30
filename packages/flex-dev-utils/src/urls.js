"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalAndNetworkUrls = exports.findPort = exports.getDefaultPort = exports.DEFAULT_PORT = void 0;
var url_1 = __importDefault(require("url"));
var net_1 = __importDefault(require("net"));
var address_1 = __importDefault(require("address"));
var env_1 = require("./env");
exports.DEFAULT_PORT = 3000;
/**
 * Finds whether the port is available
 *
 * @param port the port to check
 * @private
 */
/* istanbul ignore next */
var _findPort = function (port) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var server = net_1.default.createConnection({ port: port });
                /*
                 * If we can connect, port is not free
                 * If we cannot connect (i.e. on('error')), then port is free
                 */
                server
                    .on('connect', function () {
                    server.end();
                    reject();
                })
                    .on('error', function () { return resolve(port); });
            })];
    });
}); };
/**
 * Returns the default port
 * @param port  optional port parameter
 */
var getDefaultPort = function (port) {
    if (port) {
        var numeric = parseInt(port, 10);
        if (isNaN(numeric)) {
            return exports.DEFAULT_PORT;
        }
        return numeric;
    }
    return exports.DEFAULT_PORT;
};
exports.getDefaultPort = getDefaultPort;
/**
 * Finds the first available
 *
 * @param startPort
 */
/* istanbul ignore next */
var findPort = function (startPort) {
    if (startPort === void 0) { startPort = 3000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([_findPort(startPort)])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, startPort];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, exports.findPort(startPort + 1)];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.findPort = findPort;
/**
 * Returns the local and network urls
 * @param port  the port the server is running on
 */
var getLocalAndNetworkUrls = function (port) {
    var protocol = env_1.env.isHTTPS() ? 'https' : 'http';
    var localUrl = url_1.default.format({
        protocol: protocol,
        port: port,
        hostname: 'localhost',
        pathname: '/',
    });
    var networkUrl = url_1.default.format({
        protocol: protocol,
        port: port,
        hostname: address_1.default.ip(),
        pathname: '/',
    });
    return {
        local: {
            url: localUrl,
            port: port,
            host: '0.0.0.0',
        },
        network: {
            url: networkUrl,
            port: port,
            host: address_1.default.ip(),
        },
    };
};
exports.getLocalAndNetworkUrls = getLocalAndNetworkUrls;
exports.default = url_1.default;
//# sourceMappingURL=urls.js.map