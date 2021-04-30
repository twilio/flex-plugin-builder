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
exports._promptForTemplateUrl = exports._promptForAccountSid = void 0;
var inquirer_1 = require("flex-dev-utils/dist/inquirer");
var sids_1 = require("flex-dev-utils/dist/sids");
var validators_1 = require("flex-dev-utils/dist/validators");
/**
 * Prompts the user to enter AccountSid
 * @private
 */
var _promptForAccountSid = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, inquirer_1.prompt({
                type: 'input',
                name: 'accountSid',
                message: 'Twilio Flex Account SID',
                validate: validators_1.validateAccountSid,
            })];
    });
}); };
exports._promptForAccountSid = _promptForAccountSid;
/**
 * Prompts the user to enter template URL
 * @private
 */
var _promptForTemplateUrl = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, inquirer_1.prompt({
                type: 'input',
                name: 'template',
                message: 'Template URL',
                validate: validators_1.validateGitHubUrl,
            })];
    });
}); };
exports._promptForTemplateUrl = _promptForTemplateUrl;
/**
 * Further validates the configuration
 *
 * @param config {FlexPluginArguments}  the configuration
 * @return {Promise<FlexPluginArguments>}
 */
var validate = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                config.name = config.name || '';
                if (!(config.accountSid && !sids_1.isSidOfType(config.accountSid, sids_1.SidPrefix.AccountSid))) return [3 /*break*/, 2];
                _a = config;
                return [4 /*yield*/, exports._promptForAccountSid()];
            case 1:
                _a.accountSid = _c.sent();
                _c.label = 2;
            case 2:
                if (!(config.template && !validators_1.isValidUrl(config.template))) return [3 /*break*/, 4];
                _b = config;
                return [4 /*yield*/, exports._promptForTemplateUrl()];
            case 3:
                _b.template = _c.sent();
                _c.label = 4;
            case 4: return [2 /*return*/, config];
        }
    });
}); };
exports.default = validate;
//# sourceMappingURL=validators.js.map