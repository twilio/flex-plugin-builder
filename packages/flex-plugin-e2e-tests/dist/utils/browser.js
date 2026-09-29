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
exports.Browser = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var puppeteer_1 = __importDefault(require("puppeteer"));
var assertion_1 = __importDefault(require("./assertion"));
var pages_1 = require("./pages");
var Browser = /** @class */ (function () {
    function Browser() {
    }
    /**
     * Initializes browser object
     */
    Browser.create = function (baseUrls) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                headless: true,
                                protocolTimeout: 300000,
                                args: [
                                    '--use-fake-ui-for-media-stream',
                                    '--disable-features=site-per-process',
                                    '--no-sandbox',
                                    '--disable-setuid-sandbox',
                                ],
                            })];
                    case 1:
                        _a._browser = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this._browser.newPage()];
                    case 2:
                        _b._page = _c.sent();
                        return [4 /*yield*/, this._page.setRequestInterception(true)];
                    case 3:
                        _c.sent();
                        this._attachLogListener();
                        this._attachNetworkInterceptor();
                        this.app = new pages_1.App(this._page, baseUrls);
                        assertion_1.default.app.init(this.app);
                        return [2 /*return*/];
                }
            });
        });
    };
    Browser.kill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        flex_dev_utils_1.logger.info('Finally called');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this._page.removeAllListeners();
                        return [4 /*yield*/, this._browser.close()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        flex_dev_utils_1.logger.error('Failed to quit browser');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Attach browser log listener
     */
    Browser._attachNetworkInterceptor = function () {
        var _this = this;
        this._page.on('request', function (request) { return __awaiter(_this, void 0, void 0, function () {
            var url, re;
            return __generator(this, function (_a) {
                url = request.url();
                re = new RegExp(this._domainsToInclude.join('|'));
                if (request.resourceType() === 'script' && !re.test(url)) {
                    return [2 /*return*/, request.abort()];
                }
                return [2 /*return*/, request.continue()];
            });
        }); });
    };
    /**
     * Attach network interceptor
     */
    Browser._attachLogListener = function () {
        var _this = this;
        this._page.on('console', function (msg) {
            var logTypes = ['error'];
            var url = msg.location().url || '';
            var re = new RegExp(_this._domainsToInclude.join('|'));
            if (logTypes.includes(msg.type()) && re.test(url)) {
                flex_dev_utils_1.logger.error({
                    msg: msg.text(),
                    url: url,
                    args: msg.args() || '',
                    lineNumber: msg.location().lineNumber,
                    colNumber: msg.location().columnNumber,
                    stackTrace: msg.stackTrace() || '',
                });
            }
        });
    };
    Browser._domainsToInclude = ['twilio', 'localhost', 'unpkg'];
    return Browser;
}());
exports.Browser = Browser;
//# sourceMappingURL=browser.js.map