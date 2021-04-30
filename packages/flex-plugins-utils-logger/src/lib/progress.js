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
exports.progress = exports._getSpinner = void 0;
var flex_plugins_utils_env_1 = __importDefault(require("flex-plugins-utils-env"));
var logger_1 = __importDefault(require("./logger"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var ora = null;
/* istanbul ignore next */
var _getOra = function () {
    if (ora) {
        return ora;
    }
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    ora = require('ora');
    return ora;
};
/**
 * Added for testing purposes
 * @param title
 * @param disabled
 */
/* istanbul ignore next */
var _getSpinner = function (text, disabled) {
    if (disabled) {
        return {
            start: function () {
                // no-op
            },
            succeed: function () {
                // no-op
            },
            fail: function () {
                // no-op
            },
        };
    }
    var options = { text: text };
    if (flex_plugins_utils_env_1.default.isDebug() || flex_plugins_utils_env_1.default.isTrace()) {
        options.isEnabled = false;
    }
    return _getOra()(options);
};
exports._getSpinner = _getSpinner;
/**
 * An {@link ora} progress wrapper
 *
 * @param title   the title to show
 * @param action  the callback to run
 * @param disabled force enable the progress
 */
var progress = function (title, action, disabled) {
    if (disabled === void 0) { disabled = flex_plugins_utils_env_1.default.isQuiet(); }
    return __awaiter(void 0, void 0, void 0, function () {
        var spinner, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spinner = exports._getSpinner(logger_1.default.markdown(title) || '', disabled);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    spinner.start();
                    return [4 /*yield*/, action()];
                case 2:
                    response = _a.sent();
                    spinner.succeed();
                    return [2 /*return*/, response];
                case 3:
                    e_1 = _a.sent();
                    spinner.fail(e_1.message);
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.progress = progress;
exports.default = exports.progress;
//# sourceMappingURL=progress.js.map