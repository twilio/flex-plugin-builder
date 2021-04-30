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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_upperfirst_1 = __importDefault(require("lodash.upperfirst"));
var flex_plugins_utils_env_1 = require("flex-plugins-utils-env");
var flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
var flex_plugin_utils_http_1 = require("flex-plugin-utils-http");
var ServiceHttpClient = /** @class */ (function (_super) {
    __extends(ServiceHttpClient, _super);
    function ServiceHttpClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * List API endpoint with pagination support
     * @param uri           the uri endpoint
     * @param responseKey  response key
     * @param pagination    the request option
     */
    ServiceHttpClient.prototype.list = function (uri, responseKey, pagination) {
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, next, prev, resultKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (pagination) {
                            Object.entries(pagination).forEach(function (_a) {
                                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                                return params.set(lodash_upperfirst_1.default(key), value);
                            });
                        }
                        return [4 /*yield*/, this.get(uri + "?" + params.toString())];
                    case 1:
                        resp = _a.sent();
                        if (resp.meta.next_page_url) {
                            next = new URL(resp.meta.next_page_url);
                            if (next.searchParams.has('PageToken')) {
                                resp.meta.next_token = next.searchParams.get('PageToken');
                            }
                        }
                        if (resp.meta.previous_page_url) {
                            prev = new URL(resp.meta.previous_page_url);
                            if (prev.searchParams.has('PageToken')) {
                                resp.meta.previous_token = prev.searchParams.get('PageToken');
                            }
                        }
                        resultKey = 'results';
                        if (!resp[responseKey] && resp[resultKey]) {
                            resp[responseKey] = resp[resultKey];
                            delete resp[resultKey];
                        }
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    ServiceHttpClient.realms = ['dev', 'stage'];
    /**
     * Returns the realm if provided
     */
    ServiceHttpClient.getRealm = function (realm) {
        if (realm && ServiceHttpClient.realms.includes(realm)) {
            return "." + realm;
        }
        realm = flex_plugins_utils_env_1.env.getRealm();
        if (!realm) {
            return '';
        }
        if (!ServiceHttpClient.realms.includes(realm)) {
            flex_plugins_utils_logger_1.logger.warning('Invalid realm %s was provided, returning production realm', realm);
            return '';
        }
        return "." + realm;
    };
    return ServiceHttpClient;
}(flex_plugin_utils_http_1.HttpClient));
exports.default = ServiceHttpClient;
//# sourceMappingURL=serviceHttpClient.js.map