"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.checkForUpdate = void 0;
var update_notifier_1 = __importDefault(require("update-notifier"));
var package_json_1 = __importDefault(require("package-json"));
var fs_1 = require("./fs");
var _1 = require(".");
exports.default = update_notifier_1.default;
/**
 * Checks for update for the package
 */
/* c8 ignore next */
// eslint-disable-next-line import/no-unused-modules
var checkForUpdate = function (settings, customMessage) {
    if (settings === void 0) { settings = {}; }
    if (customMessage === void 0) { customMessage = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var pkg, pkgInfo, notifier, message;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    pkg = module.parent ? fs_1.readPackageJson(fs_1.findUp(module.parent.filename, 'package.json')) : fs_1.readAppPackageJson();
                    return [4 /*yield*/, package_json_1.default(pkg.name, { version: pkg.version })];
                case 1:
                    pkgInfo = _c.sent();
                    notifier = update_notifier_1.default(__assign({ pkg: pkg, updateCheckInterval: 1000 }, settings));
                    message = (pkgInfo.deprecated
                        ? _1.chalk.bgYellow.bold('You are currently using a deprecated version of Flex Plugin CLI') + "\n\n"
                        : '') + "Update available " + _1.chalk.dim((_a = notifier.update) === null || _a === void 0 ? void 0 : _a.current) + _1.chalk.reset(' → ') + _1.chalk.green((_b = notifier.update) === null || _b === void 0 ? void 0 : _b.latest) + " \nRun " + _1.chalk.cyan('twilio plugins:install @twilio-labs/plugin-flex') + " to update";
                    notifier.notify(__assign({ message: message }, customMessage));
                    return [2 /*return*/];
            }
        });
    });
};
exports.checkForUpdate = checkForUpdate;
//# sourceMappingURL=updateNotifier.js.map