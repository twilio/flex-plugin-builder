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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var sids_1 = require("flex-dev-utils/dist/sids");
var baseClient_1 = __importDefault(require("./baseClient"));
var serverless_types_1 = require("./serverless-types");
var services_1 = __importDefault(require("./services"));
var BuildClient = /** @class */ (function (_super) {
    __extends(BuildClient, _super);
    function BuildClient(auth, serviceSid) {
        var _this = _super.call(this, auth, services_1.default.getBaseUrl() + "/Services/" + serviceSid) || this;
        /**
         * Creates a new {@link Build} and then polls the endpoint once a second until the build is
         * complete.
         *
         * @param data  the build data
         */
        _this.create = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var newBuild, sid, timeoutId, intervalId;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this._create(data)];
                                case 1:
                                    newBuild = _a.sent();
                                    sid = newBuild.sid;
                                    timeoutId = setTimeout(function () {
                                        // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
                                        clearInterval(intervalId);
                                        reject('Timeout while waiting for new Twilio Runtime build status to change to complete.');
                                    }, BuildClient.timeoutMsec);
                                    intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var build;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    flex_dev_utils_1.logger.debug('Checking Serverless Build status');
                                                    return [4 /*yield*/, this.get(sid)];
                                                case 1:
                                                    build = _a.sent();
                                                    flex_dev_utils_1.logger.debug('Build status is', build.status);
                                                    if (build.status === serverless_types_1.BuildStatus.Failed) {
                                                        clearInterval(intervalId);
                                                        clearTimeout(timeoutId);
                                                        reject('Twilio Runtime build has failed.');
                                                    }
                                                    if (build.status === serverless_types_1.BuildStatus.Completed) {
                                                        clearInterval(intervalId);
                                                        clearTimeout(timeoutId);
                                                        resolve(build);
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, BuildClient.pollingIntervalMsec);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        }); };
        /**
         * Fetches a build by buildSid
         *
         * @param sid  the build sid to fetch
         */
        _this.get = function (sid) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!sids_1.isSidOfType(sid, sids_1.SidPrefix.BuildSid)) {
                    throw new Error(sid + " is not of type " + sids_1.SidPrefix.BuildSid);
                }
                return [2 /*return*/, this.http.get(BuildClient.BaseUri + "/" + sid)];
            });
        }); };
        /**
         * Creates a new instance of build
         *
         * @param data  the build data
         * @private
         */
        _this._create = function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.http.post(BuildClient.BaseUri, data)];
            });
        }); };
        if (!sids_1.isSidOfType(serviceSid, sids_1.SidPrefix.ServiceSid)) {
            throw new Error("ServiceSid " + serviceSid + " is not valid");
        }
        return _this;
    }
    BuildClient.BaseUri = 'Builds';
    BuildClient.timeoutMsec = 60000;
    BuildClient.pollingIntervalMsec = 500;
    return BuildClient;
}(baseClient_1.default));
exports.default = BuildClient;
//# sourceMappingURL=builds.js.map