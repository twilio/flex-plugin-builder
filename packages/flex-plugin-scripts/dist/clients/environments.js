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
/* eslint-disable camelcase */
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var sids_1 = require("@twilio/flex-dev-utils/dist/sids");
var random_1 = require("@twilio/flex-dev-utils/dist/random");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var RESPONSE_KEY = 'environments';
var EnvironmentClient = /** @class */ (function () {
    function EnvironmentClient(http, serviceSid) {
        var _this = this;
        /**
         * Returns the {@link Environment} that has the same name as the packageName
         *
         * @param create    if set to true, will create an environment if not found
         */
        this.get = function (create) {
            if (create === void 0) { create = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.list()
                            .then(function (environments) { return environments.find(function (s) { return s.unique_name === fs_1.getPaths().app.name; }); })
                            .then(function (environment) {
                            if (!environment) {
                                if (create) {
                                    return _this.create();
                                }
                                throw new Error("No environment with unique_name " + fs_1.getPaths().app.name + " was found");
                            }
                            return environment;
                        })];
                });
            });
        };
        /**
         * Creates an {@link ServerlessEnvironment} with the package name
         */
        this.create = function () { return __awaiter(_this, void 0, void 0, function () {
            var environments, existingDomains, domainSuffix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.list()];
                    case 1:
                        environments = _a.sent();
                        existingDomains = environments.map(function (environment) { return environment.domain_suffix; });
                        domainSuffix = random_1.randomString(EnvironmentClient.DomainSuffixLength, existingDomains);
                        return [2 /*return*/, this.http.post(flex_dev_utils_1.urlJoin('Services', this.serviceSid, 'Environments'), {
                                UniqueName: fs_1.getPaths().app.name,
                                DomainSuffix: domainSuffix,
                            })];
                }
            });
        }); };
        /**
         * Removes the {@link ServerlessEnvironment}
         */
        this.remove = function (sid) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!sids_1.isSidOfType(sid, sids_1.SidPrefix.EnvironmentSid)) {
                    throw new Error(sid + " is not of type " + sids_1.SidPrefix.EnvironmentSid);
                }
                return [2 /*return*/, this.http.delete(flex_dev_utils_1.urlJoin('Services', this.serviceSid, 'Environments', sid))];
            });
        }); };
        /**
         * Fetches the list of {@link ServerlessEnvironment}
         */
        this.list = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.http
                        .list(flex_dev_utils_1.urlJoin('Services', this.serviceSid, 'Environments'), RESPONSE_KEY)
                        .then(function (resp) { return resp[RESPONSE_KEY]; })];
            });
        }); };
        if (!sids_1.isSidOfType(serviceSid, sids_1.SidPrefix.ServiceSid)) {
            throw new flex_dev_utils_1.TwilioCliError(serviceSid + " is not of type " + sids_1.SidPrefix.ServiceSid);
        }
        this.http = http;
        this.serviceSid = serviceSid;
    }
    EnvironmentClient.DomainSuffixLength = 5;
    return EnvironmentClient;
}());
exports.default = EnvironmentClient;
//# sourceMappingURL=environments.js.map