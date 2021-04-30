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
exports.clearCredentials = exports.getCredential = exports._saveCredential = exports._findCredential = exports._getService = exports._getKeychain = exports.SERVICE_NAME = void 0;
/* eslint-disable prefer-destructuring */
var errors_1 = require("./errors");
var inquirer_1 = require("./inquirer");
var env_1 = require("./env");
var keychain_1 = __importDefault(require("./keychain"));
var validators_1 = require("./validators");
exports.SERVICE_NAME = 'com.twilio.flex.plugins.builder';
var accountSidQuestion = {
    type: 'input',
    name: 'accountSid',
    message: 'Enter your Twilio Account Sid:',
    validate: validators_1.validateAccountSid,
};
var authTokenQuestion = {
    type: 'password',
    name: 'authToken',
    message: 'Enter your Twilio Auth Token:',
    validate: validators_1.isInputNotEmpty,
};
var chooseAccount = {
    type: 'list',
    name: 'account',
    message: 'Choose one of the following Account Sids:',
};
/**
 * Instantiates a keychain to use
 */
var _getKeychain = function () { return keychain_1.default(exports.SERVICE_NAME); };
exports._getKeychain = _getKeychain;
/**
 * Gets the credential service
 * @private
 */
var _getService = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (env_1.env.isCI()) {
            return [2 /*return*/, []];
        }
        return [2 /*return*/, exports._getKeychain().findCredentials()];
    });
}); };
exports._getService = _getService;
/**
 * Finds the credential. If more than one credential exists, then it prompt the user to choose one.
 *
 * @param accountSid  optional accountSid to find
 * @private
 */
var _findCredential = function (accountSid) { return __awaiter(void 0, void 0, void 0, function () {
    var convertCredential, credentials, match, accounts, selectedAccount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                convertCredential = function (credential) { return ({
                    username: credential.account,
                    password: credential.password,
                }); };
                return [4 /*yield*/, exports._getService()];
            case 1:
                credentials = _a.sent();
                if (accountSid) {
                    match = credentials.find(function (cred) { return cred.account === accountSid; });
                    if (match) {
                        return [2 /*return*/, convertCredential(match)];
                    }
                }
                accounts = credentials
                    .map(function (cred) { return cred.account; })
                    .filter(function (acc) { return acc.length === 34 && (acc.substr(0, 2) === 'AC' || acc.substr(0, 2) === 'SK'); });
                if (credentials.length === 0) {
                    return [2 /*return*/, null];
                }
                if (credentials.length === 1) {
                    return [2 /*return*/, convertCredential(credentials[0])];
                }
                if (accounts.length === 0) {
                    return [2 /*return*/, null];
                }
                /* istanbul ignore next */
                if (accounts.length === 1) {
                    return [2 /*return*/, convertCredential(credentials.find(function (cred) { return cred.account === accounts[0]; }))];
                }
                return [4 /*yield*/, inquirer_1.choose(chooseAccount, accounts)];
            case 2:
                selectedAccount = _a.sent();
                return [2 /*return*/, convertCredential(credentials.find(function (cred) { return cred.account === selectedAccount; }))];
        }
    });
}); };
exports._findCredential = _findCredential;
/**
 * Saves the credential
 *
 * @param username   the username
 * @param password  the password
 * @private
 */
var _saveCredential = function (username, password) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!env_1.env.isCI() && !process.env.SKIP_CREDENTIALS_SAVING)) return [3 /*break*/, 2];
                return [4 /*yield*/, exports._getKeychain().setPassword(username, password)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports._saveCredential = _saveCredential;
/**
 * Fetches the API Key/Secret and stores them in keychain.
 * If no credentials exists, then prompts the user to enter the credentials
 */
var getCredential = function () { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, missingCredentials, credential;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                missingCredentials = !((process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) ||
                    (process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET));
                if (env_1.env.isCI() && missingCredentials) {
                    throw new errors_1.FlexPluginError('❌.  Running script in CI, but no AccountSid/AuthToken or API Key/Secret was provided');
                }
                if (!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)) return [3 /*break*/, 2];
                return [4 /*yield*/, validators_1.validateAccountSid(process.env.TWILIO_ACCOUNT_SID)];
            case 1:
                if (!(_a.sent())) {
                    throw new errors_1.FlexPluginError('AccountSid is not valid.');
                }
                username = process.env.TWILIO_ACCOUNT_SID;
                password = process.env.TWILIO_AUTH_TOKEN;
                return [3 /*break*/, 6];
            case 2:
                if (!(process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET)) return [3 /*break*/, 4];
                return [4 /*yield*/, validators_1.validateApiKey(process.env.TWILIO_API_KEY)];
            case 3:
                if (!(_a.sent())) {
                    throw new errors_1.FlexPluginError('API Key is not valid.');
                }
                username = process.env.TWILIO_API_KEY;
                password = process.env.TWILIO_API_SECRET;
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, exports._findCredential(process.env.TWILIO_ACCOUNT_SID)];
            case 5:
                credential = _a.sent();
                if (credential) {
                    username = credential.username;
                    password = credential.password;
                }
                _a.label = 6;
            case 6:
                if (!(!username || !password)) return [3 /*break*/, 9];
                return [4 /*yield*/, inquirer_1.prompt(accountSidQuestion)];
            case 7:
                username = _a.sent();
                return [4 /*yield*/, inquirer_1.prompt(authTokenQuestion)];
            case 8:
                password = _a.sent();
                _a.label = 9;
            case 9: 
            // Save the credential
            return [4 /*yield*/, exports._saveCredential(username, password)];
            case 10:
                // Save the credential
                _a.sent();
                return [2 /*return*/, { username: username, password: password }];
        }
    });
}); };
exports.getCredential = getCredential;
/**
 * Clears the credentials
 */
var clearCredentials = function () { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, promises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (env_1.env.isCI()) {
                    return [2 /*return*/, Promise.resolve()];
                }
                return [4 /*yield*/, exports._getService()];
            case 1:
                credentials = _a.sent();
                promises = credentials.map(function (cred) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, exports._getKeychain().deletePassword(cred.account)];
                }); }); });
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                _a.sent();
                return [2 /*return*/, Promise.resolve()];
        }
    });
}); };
exports.clearCredentials = clearCredentials;
exports.default = exports.getCredential;
//# sourceMappingURL=credentials.js.map