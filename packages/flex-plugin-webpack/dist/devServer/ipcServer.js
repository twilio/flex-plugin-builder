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
exports.emitDevServerCrashed = exports.emitCompileComplete = exports.emitAllCompilesComplete = exports.onIPCServerMessage = exports.startIPCClient = exports.startIPCServer = exports._emitToServer = exports._onClientConnected = exports._onServerMessage = exports._processEmitQueue = exports.isClientConnected = exports.isServerRunning = exports.IPCType = void 0;
var node_ipc_1 = __importDefault(require("node-ipc"));
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var IPCType;
(function (IPCType) {
    IPCType["onCompileComplete"] = "onCompileComplete";
    IPCType["onDevServerCrashed"] = "onDevServerCrashed";
    IPCType["onEmitAllCompilesComplete"] = "onEmitAllCompilesComplete";
})(IPCType = exports.IPCType || (exports.IPCType = {}));
node_ipc_1.default.config.id = 'twilio.flex.plugin-builder';
node_ipc_1.default.config.retry = 1500;
node_ipc_1.default.config.silent = !flex_dev_utils_1.env.isDebug();
var _isServerRunning = false;
var _isClientConnected = false;
/* c8 ignore next */
var isServerRunning = function () { return _isServerRunning; };
exports.isServerRunning = isServerRunning;
/* c8 ignore next */
var isClientConnected = function () { return _isClientConnected; };
exports.isClientConnected = isClientConnected;
var clientNode = null;
var messageCallbacks = {};
/*
 * This is used only to set the type of this queue
 * This is the only way to get dynamic typing in TS :(
 */
var getEmitItem = function (type, payload) { return ({ type: type, payload: payload }); };
var emitQueue = [getEmitItem()].slice(1);
/**
 * Processes the emit queue
 * @private
 */
/* c8 ignore next */
var _processEmitQueue = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!exports.isClientConnected()) {
            return [2 /*return*/];
        }
        while (emitQueue.length) {
            clientNode.emit('message', emitQueue.pop());
        }
        return [2 /*return*/];
    });
}); };
exports._processEmitQueue = _processEmitQueue;
/**
 * Processes the on server message
 * @param data
 * @private
 */
var _onServerMessage = function (data) {
    if (!data.type) {
        flex_dev_utils_1.logger.error('IPC got an unexpected message: ', data);
        return;
    }
    Object.keys(messageCallbacks)
        .filter(function (type) { return type === data.type; })
        .forEach(function (type) {
        var _a;
        if (messageCallbacks[type]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (_a = messageCallbacks[type]) === null || _a === void 0 ? void 0 : _a.forEach(function (cb) { return cb(data.payload); });
        }
    });
};
exports._onServerMessage = _onServerMessage;
/**
 * Processes on client connected
 * @private
 */
var _onClientConnected = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _isClientConnected = true;
                return [4 /*yield*/, exports._processEmitQueue()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports._onClientConnected = _onClientConnected;
/**
 * Emits to the server
 * @param type      the event type
 * @param payload   the event payload
 * @private
 */
var _emitToServer = function (type, payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emitQueue.push({ type: type, payload: payload });
                return [4 /*yield*/, exports._processEmitQueue()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports._emitToServer = _emitToServer;
/**
 * Starts an IPC server
 */
var startIPCServer = function () {
    if (exports.isServerRunning()) {
        return;
    }
    node_ipc_1.default.serve(function () { return node_ipc_1.default.server.on('message', exports._onServerMessage); });
    node_ipc_1.default.server.start();
    _isServerRunning = true;
};
exports.startIPCServer = startIPCServer;
/**
 * Starts an IPC Client
 */
var startIPCClient = function () {
    if (exports.isClientConnected()) {
        return;
    }
    node_ipc_1.default.connectTo(node_ipc_1.default.config.id, function () {
        clientNode = node_ipc_1.default.of[node_ipc_1.default.config.id];
        clientNode.on('connect', exports._onClientConnected);
    });
};
exports.startIPCClient = startIPCClient;
/**
 * onMessage event for the IPC server
 * @param type
 * @param callback
 */
/* c8 ignore next */
var onIPCServerMessage = function (type, callback) {
    if (!(type in messageCallbacks)) {
        messageCallbacks[type] = [];
    }
    // @ts-ignore
    messageCallbacks[type].push(callback);
};
exports.onIPCServerMessage = onIPCServerMessage;
/**
 * Emits to the server that all of the JS Bundles have completed compiling
 * @param payload
 * @returns
 */
var emitAllCompilesComplete = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, exports._emitToServer(IPCType.onEmitAllCompilesComplete, {})];
}); }); };
exports.emitAllCompilesComplete = emitAllCompilesComplete;
/**
 * Emits a compilation complete event
 * @param payload
 */
var emitCompileComplete = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports._emitToServer(IPCType.onCompileComplete, payload)];
            case 1:
                _a.sent();
                if (!payload.lastPluginBundle) return [3 /*break*/, 3];
                return [4 /*yield*/, exports.emitAllCompilesComplete()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.emitCompileComplete = emitCompileComplete;
/**
 * Emits a dev-server failed event
 * @param error
 */
var emitDevServerCrashed = function (error) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, exports._emitToServer(IPCType.onDevServerCrashed, {
                exception: {
                    message: error.message,
                    stack: error.stack,
                },
            })];
    });
}); };
exports.emitDevServerCrashed = emitDevServerCrashed;
//# sourceMappingURL=ipcServer.js.map