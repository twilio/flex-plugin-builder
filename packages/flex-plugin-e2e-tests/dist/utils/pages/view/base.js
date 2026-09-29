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
exports.Base = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var timers_1 = require("../../timers");
var Base = /** @class */ (function () {
    function Base(page) {
        this.page = page;
    }
    /**
     * Navigate to the given url
     * @param baseUrl
     * @param path
     */
    Base.prototype.goto = function (_a) {
        var baseUrl = _a.baseUrl, path = _a.path, waitUntil = _a.waitUntil;
        return __awaiter(this, void 0, void 0, function () {
            var fullPath, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fullPath = path ? baseUrl + "/" + path : baseUrl;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, Promise.all([
                                this.page.waitForNavigation({
                                    waitUntil: 'networkidle2',
                                    timeout: Base.DEFAULT_PAGE_LOAD_TIMEOUT,
                                }),
                                this.page.goto(fullPath, {
                                    waitUntil: waitUntil || 'networkidle2',
                                    timeout: Base.DEFAULT_PAGE_LOAD_TIMEOUT,
                                }),
                            ])];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        err_1 = _b.sent();
                        if (!err_1.message.includes('detached')) return [3 /*break*/, 5];
                        flex_dev_utils_1.logger.error('Page has been detached. adding a sleep to let other processes finish');
                        /*
                         * Just let it wait the rest of the timeout so the other contestants in the rest
                         * can finish first.
                         */
                        return [4 /*yield*/, timers_1.sleep(5000)];
                    case 4:
                        /*
                         * Just let it wait the rest of the timeout so the other contestants in the rest
                         * can finish first.
                         */
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get text from an element
     * @param element
     * @param elementName
     */
    Base.prototype.getText = function (element, elementName) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, element.evaluate(function (el) { return el.textContent; })];
                    case 1:
                        text = _a.sent();
                        if (!text) {
                            throw new Error(elementName + " does not contain any text");
                        }
                        return [2 /*return*/, text];
                }
            });
        });
    };
    /**
     * Input value into an element
     * @param element
     * @param value
     */
    Base.prototype.inputText = function (selector, value) {
        return __awaiter(this, void 0, void 0, function () {
            var element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.elementVisible(selector, selector.substring(1))];
                    case 1:
                        element = _a.sent();
                        if (!element) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.type(selector, value)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error('Something went wrong while entering value');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Click on an element
     * @param element
     */
    Base.prototype.click = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.elementVisible(selector, selector.substring(1))];
                    case 1:
                        element = _a.sent();
                        if (!element) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.page.click(selector)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error('Something went wrong while clicking a button');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check that element exists and is visible
     * @param selector element which should be visible
     * @param elementName name of the searchable element
     * @param timeout time to wait for until element is visible in the UI
     */
    Base.prototype.elementVisible = function (seletor, elementName, timeout) {
        if (timeout === void 0) { timeout = Base.DEFAULT_LOCATE_TIMEOUT; }
        return __awaiter(this, void 0, void 0, function () {
            var waitOptions, element;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        waitOptions = { timeout: timeout };
                        if (!seletor.startsWith('//')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.page.waitForXPath(seletor, waitOptions)];
                    case 1:
                        element = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.page.waitForSelector(seletor, waitOptions)];
                    case 3:
                        // @ts-ignore
                        element = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!element) {
                            throw new Error("Element: " + elementName + " is not visible in the UI");
                        }
                        return [2 /*return*/, element];
                }
            });
        });
    };
    Base.DEFAULT_LOCATE_TIMEOUT = 3000000;
    Base.DEFAULT_PAGE_LOAD_TIMEOUT = 3000000;
    return Base;
}());
exports.Base = Base;
//# sourceMappingURL=base.js.map