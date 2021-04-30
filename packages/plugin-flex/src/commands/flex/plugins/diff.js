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
var flex_dev_utils_1 = require("flex-dev-utils");
var general_1 = require("../../../utils/general");
var flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
var strings_1 = require("../../../utils/strings");
/**
 * Configuration sid parser
 * @param input the input from the CLI
 */
var parser = function (input) {
    if (input === 'active') {
        return input;
    }
    if (!input || !input.startsWith('FJ')) {
        throw new flex_dev_utils_1.TwilioCliError("Identifier must of a ConfigurationSid or 'active'; instead got " + input);
    }
    return input;
};
var baseFlags = __assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Finds the difference between two Flex Plugin Configuration
 */
var FlexPluginsDiff = /** @class */ (function (_super) {
    __extends(FlexPluginsDiff, _super);
    function FlexPluginsDiff(argv, config, secureStorage) {
        return _super.call(this, argv, config, secureStorage, { runInDirectory: false }) || this;
    }
    /**
     * @override
     */
    FlexPluginsDiff.prototype.doRun = function () {
        return __awaiter(this, void 0, void 0, function () {
            var diffs, oldSidText, newSidText;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDiffs()];
                    case 1:
                        diffs = _a.sent();
                        oldSidText = diffs.activeSid === diffs.oldSid ? diffs.oldSid + " (active)" : diffs.oldSid;
                        newSidText = diffs.activeSid === diffs.newSid ? diffs.newSid + " (active)" : diffs.newSid;
                        this._logger.info("Showing the changes from releasing **" + oldSidText + "** to **" + newSidText + "**");
                        this._logger.newline();
                        diffs.configuration.forEach(function (diff) { return _this.printDiff(diff); });
                        this._logger.newline();
                        this.printHeader('Plugins');
                        Object.keys(diffs.plugins).forEach(function (key) {
                            var isDeleted = diffs.plugins[key].every(function (diff) { return strings_1.isNullOrUndefined(diff.after) && !strings_1.isNullOrUndefined(diff.before); });
                            var isAdded = diffs.plugins[key].every(function (diff) { return strings_1.isNullOrUndefined(diff.before) && !strings_1.isNullOrUndefined(diff.after); });
                            if (isDeleted) {
                                _this._logger.info("**--- " + key + "--**");
                            }
                            else if (isAdded) {
                                _this._logger.info("**+++ " + key + "++**");
                            }
                            else {
                                _this._logger.info("**" + key + "**");
                            }
                            diffs.plugins[key].forEach(function (diff) { return _this.printDiff(diff, FlexPluginsDiff.pluginDiffPrefix); });
                            _this._logger.newline();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds the diff
     */
    FlexPluginsDiff.prototype.getDiffs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id1, id2;
            return __generator(this, function (_b) {
                _a = this._args, id1 = _a.id1, id2 = _a.id2;
                return [2 /*return*/, this.pluginsApiToolkit.diff({
                        resource: 'configuration',
                        oldIdentifier: id2 ? id1 : 'active',
                        newIdentifier: id2 ? id2 : id1,
                    })];
            });
        });
    };
    /**
     * Prints the diff
     * @param diff    the diff to print
     * @param prefix  the prefix to add to each entry
     */
    FlexPluginsDiff.prototype.printDiff = function (diff, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var path = diff.path;
        var before = diff.before;
        var after = diff.after;
        var header = flex_plugin_1.default.getHeader(path);
        if (diff.hasDiff) {
            if (!strings_1.isNullOrUndefined(before)) {
                this._logger.info(prefix + "--- " + header + ": " + flex_plugin_1.default.getValue(path, before) + "--");
            }
            if (!strings_1.isNullOrUndefined(after)) {
                this._logger.info(prefix + "+++ " + header + ": " + flex_plugin_1.default.getValue(path, after) + "++");
            }
        }
        else {
            this._logger.info("" + prefix + header + ": " + flex_plugin_1.default.getValue(path, before));
        }
    };
    Object.defineProperty(FlexPluginsDiff.prototype, "_flags", {
        /**
         * Parses the flags passed to this command
         */
        /* istanbul ignore next */
        get: function () {
            return this.parse(FlexPluginsDiff).flags;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPluginsDiff.prototype, "_args", {
        /* istanbul ignore next */
        get: function () {
            return this.parse(FlexPluginsDiff).args;
        },
        enumerable: false,
        configurable: true
    });
    FlexPluginsDiff.topicName = 'flex:plugins:diff';
    FlexPluginsDiff.pluginDiffPrefix = '..│.. ';
    FlexPluginsDiff.description = general_1.createDescription(FlexPluginsDiff.topic.description, false);
    FlexPluginsDiff.args = [
        {
            description: FlexPluginsDiff.topic.args.id1,
            name: 'id1',
            required: true,
            parse: parser,
        },
        {
            description: FlexPluginsDiff.topic.args.id2,
            name: 'id2',
            arse: parser,
        },
    ];
    FlexPluginsDiff.flags = __assign({}, baseFlags);
    return FlexPluginsDiff;
}(flex_plugin_1.default));
exports.default = FlexPluginsDiff;
//# sourceMappingURL=diff.js.map