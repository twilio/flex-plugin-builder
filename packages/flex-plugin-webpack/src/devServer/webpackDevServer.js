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
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var flex_dev_utils_1 = require("flex-dev-utils");
var urls_1 = require("flex-dev-utils/dist/urls");
var __1 = require("..");
var termSignals = ['SIGTERM', 'SIGINT'];
/**
 * Starts a {@link WebpackDevServer}
 * @param devCompiler the {@link Compiler} compiler
 * @param devConfig the dev {@link Configuration}
 * @param type the {@link WebpackType}
 */
exports.default = (function (devCompiler, devConfig, type) {
    var port = flex_dev_utils_1.env.getPort();
    var local = urls_1.getLocalAndNetworkUrls(port).local;
    var isJavaScriptServer = type === __1.WebpackType.JavaScript;
    var isStaticServer = type === __1.WebpackType.Static;
    var devServer = new webpack_dev_server_1.default(devCompiler, devConfig);
    if (!isStaticServer) {
        // Show TS errors on browser
        devCompiler.hooks.tsCompiled.tap('afterTSCompile', function (warnings, errors) {
            if (warnings.length) {
                devServer.sockWrite(devServer.sockets, 'warnings', warnings);
            }
            if (errors.length) {
                devServer.sockWrite(devServer.sockets, 'errors', errors);
            }
        });
    }
    // Start the dev-server
    devServer.listen(local.port, local.host, function (err) { return __awaiter(void 0, void 0, void 0, function () {
        var serverType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        flex_dev_utils_1.logger.error(err);
                        return [2 /*return*/];
                    }
                    serverType = type === __1.WebpackType.Complete ? '' : "(" + type + ")";
                    if (isJavaScriptServer) {
                        flex_dev_utils_1.logger.debug('Starting development server %s...', serverType);
                    }
                    else {
                        flex_dev_utils_1.logger.clearTerminal();
                        flex_dev_utils_1.logger.notice('Starting development server %s...', serverType);
                    }
                    if (!!isJavaScriptServer) return [3 /*break*/, 2];
                    return [4 /*yield*/, flex_dev_utils_1.open(local.url)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    // Close server and exit
    var cleanUp = function () {
        devServer.close();
        flex_dev_utils_1.exit(0);
    };
    termSignals.forEach(function (sig) { return process.on(sig, cleanUp); });
    if (!flex_dev_utils_1.env.isCI()) {
        process.stdin.on('end', cleanUp);
        process.stdin.resume();
    }
});
//# sourceMappingURL=webpackDevServer.js.map