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
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var fs_1 = require("fs");
var __1 = require("..");
var admin_dashboard_1 = require("./view/admin-dashboard");
var agent_desktop_1 = require("./view/agent-desktop");
var plugins_1 = require("./view/plugins");
var twilio_console_1 = require("./view/twilio-console");
var screenshotExtension = '.png';
var App = /** @class */ (function () {
    function App(page, _a) {
        var flex = _a.flex, twilioConsole = _a.twilioConsole;
        this._page = page;
        this._agentDesktop = new agent_desktop_1.AgentDesktop(page, flex);
        this._adminDashboard = new admin_dashboard_1.AdminDashboard(page, flex);
        this._twilioConsole = new twilio_console_1.TwilioConsole(page, { twilioConsole: twilioConsole, flex: flex });
        this._plugins = new plugins_1.Plugins(page, flex);
        this.assert = {
            agentDesktop: this._agentDesktop.assert,
            adminDashboard: this._adminDashboard.assert,
            twilioConsole: this._twilioConsole.assert,
            plugins: this._plugins.assert,
        };
    }
    Object.defineProperty(App.prototype, "agentDesktop", {
        get: function () {
            return this._agentDesktop;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(App.prototype, "adminDashboard", {
        get: function () {
            return this._adminDashboard;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(App.prototype, "plugins", {
        get: function () {
            return this._plugins;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(App.prototype, "twilioConsole", {
        get: function () {
            return this._twilioConsole;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets account sid from browser's console
     */
    App.prototype.getFlexAccountSid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var Twilio;
            return __generator(this, function (_a) {
                return [2 /*return*/, this._page.evaluate(function () {
                        return Twilio.Flex.Manager.getInstance().serviceConfiguration.account_sid;
                    })];
            });
        });
    };
    /**
     * Takes screenshot of the current page
     * @param rootDir
     * @param screenshotName
     */
    App.prototype.takeScreenshot = function (rootDir, screenshotName) {
        if (screenshotName === void 0) { screenshotName = "on_failure." + screenshotExtension; }
        return __awaiter(this, void 0, void 0, function () {
            var screenshotDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        screenshotDir = __1.joinPath(rootDir, 'screenshots');
                        if (!screenshotName.endsWith(screenshotExtension)) {
                            screenshotName += screenshotExtension;
                        }
                        if (!fs_1.existsSync(screenshotDir)) {
                            fs_1.mkdirSync(screenshotDir);
                        }
                        return [4 /*yield*/, this._page.screenshot({ path: __1.joinPath(screenshotDir, screenshotName) })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map