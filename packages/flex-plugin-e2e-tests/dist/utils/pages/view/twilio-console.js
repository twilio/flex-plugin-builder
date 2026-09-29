"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioConsole = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var core_1 = require("../../../core");
var base_1 = require("./base");
var timers_1 = require("../../timers");
var TwilioConsole = /** @class */ (function (_super) {
    __extends(TwilioConsole, _super);
    function TwilioConsole(page, _a) {
        var flex = _a.flex, twilioConsole = _a.twilioConsole;
        var _this = _super.call(this, page) || this;
        _this.assert = {};
        _this._baseUrl = twilioConsole;
        _this._flexBaseUrl = flex;
        return _this;
    }
    /**
     * Logs user in through service-login
     * @param flexPath
     * @param accountSid
     * @param localhostPort
     * @param firstLoad
     */
    TwilioConsole.prototype.login = function (flexPath, accountSid, localhostPort, firstLoad) {
        if (firstLoad === void 0) { firstLoad = true; }
        return __awaiter(this, void 0, void 0, function () {
            var redirectUrl, path, csrfToken, twVisitorCookie, csrfResponse, setCookieHeader, match, data, e_1, loginURL, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        flex_dev_utils_1.logger.info('firstload', firstLoad);
                        redirectUrl = this._flexBaseUrl.includes('localhost')
                            ? TwilioConsole._createLocalhostUrl(localhostPort)
                            : this._flexBaseUrl;
                        path = "console/flex/service-login/" + accountSid + "/?path=/" + flexPath + "&referer=" + redirectUrl;
                        return [4 /*yield*/, this.goto({ baseUrl: this._baseUrl, path: path })];
                    case 1:
                        _a.sent();
                        if (!firstLoad) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.elementVisible(TwilioConsole._loginForm, "Twilio Console's Login form")];
                    case 2:
                        _a.sent();
                        csrfToken = null;
                        twVisitorCookie = null;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, fetch(this._baseUrl + "/api/csrf", { method: 'GET' })];
                    case 4:
                        csrfResponse = _a.sent();
                        setCookieHeader = csrfResponse.headers.get('set-cookie');
                        if (setCookieHeader) {
                            match = setCookieHeader.match(/tw-visitor=([^;]+);/);
                            twVisitorCookie = match ? match[1] : null;
                        }
                        return [4 /*yield*/, csrfResponse.json()];
                    case 5:
                        data = _a.sent();
                        csrfToken = data.csrf || null;
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        flex_dev_utils_1.logger.info('CSRF fetch failed:', e_1);
                        return [3 /*break*/, 7];
                    case 7:
                        if (!(csrfToken && twVisitorCookie)) return [3 /*break*/, 12];
                        loginURL = this._baseUrl + "/userauth/submitLoginPassword";
                        return [4 /*yield*/, this.page.setCookie({
                                name: 'tw-visitor',
                                value: twVisitorCookie,
                                domain: new URL(this._baseUrl).hostname,
                            })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.page.evaluate(function (data) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, fetch(data.url, {
                                                headers: {
                                                    'x-twilio-csrf': data.csrfToken || '',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    email: data.email,
                                                    password: data.password,
                                                }),
                                                credentials: 'include',
                                                method: 'POST',
                                            })
                                                .then(function (response) {
                                                return {
                                                    status: response.status,
                                                    headers: (function () {
                                                        var headersObj = {};
                                                        response.headers.forEach(function (value, key) {
                                                            headersObj[key] = value;
                                                        });
                                                        return headersObj;
                                                    })(),
                                                };
                                            })
                                                .catch(function (err) {
                                                return {
                                                    error: err.message || 'Unknown error during fetch',
                                                };
                                            })];
                                    });
                                });
                            }, {
                                url: loginURL,
                                email: core_1.testParams.secrets.console.email,
                                password: core_1.testParams.secrets.console.password,
                                csrfToken: csrfToken,
                                twVisitorCookie: twVisitorCookie,
                            })];
                    case 9:
                        result = _a.sent();
                        // Wait for cookies to be set after successful login
                        return [4 /*yield*/, timers_1.sleep(2000)];
                    case 10:
                        // Wait for cookies to be set after successful login
                        _a.sent();
                        flex_dev_utils_1.logger.info('Navigating to Flex admin directly after successful login');
                        return [4 /*yield*/, this.goto({ baseUrl: flexPath === 'admin' ? this._flexBaseUrl : this._baseUrl, path: flexPath === 'admin' ? flexPath : path })];
                    case 11:
                        _a.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        flex_dev_utils_1.logger.error('Unable to fetch CSRF token or tw-visitor cookie for Twilio Console login');
                        throw new Error('Unable to fetch CSRF token or tw-visitor cookie to login to Twilio Console');
                    case 13: return [4 /*yield*/, timers_1.sleep(60000)];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TwilioConsole._loginForm = '#email';
    /**
     * Creates a localhost url
     * @param port
     */
    TwilioConsole._createLocalhostUrl = function (port) { return "http://localhost:" + port + "&localPort=" + port; };
    return TwilioConsole;
}(base_1.Base));
exports.TwilioConsole = TwilioConsole;
//# sourceMappingURL=twilio-console.js.map