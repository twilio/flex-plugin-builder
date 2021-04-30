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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var qs_1 = __importDefault(require("qs"));
var axios_cache_adapter_1 = require("axios-cache-adapter");
var axios_1 = __importDefault(require("axios"));
var flex_plugins_utils_env_1 = require("flex-plugins-utils-env");
var flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
var flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
var Http = /** @class */ (function () {
    function Http(config) {
        this.cacheAge = 15 * 60 * 1000;
        var cache = axios_cache_adapter_1.setupCache({ maxAge: 0 });
        var axiosConfig = {
            baseURL: config.baseURL,
            headers: __assign({ 'Content-Type': Http.ContentType }, config.headers),
            adapter: cache.adapter,
        };
        if (config.auth) {
            axiosConfig.auth = {
                username: config.auth.username,
                password: config.auth.password,
            };
        }
        if (config.setUserAgent) {
            axiosConfig.headers[Http.UserAgent] = Http.getUserAgent(config);
        }
        this.client = axios_1.default.create(axiosConfig);
        this.client.interceptors.request.use(Http.transformRequest([Http.transformRequestFormData].concat(config.requestInterceptors || [])));
        this.client.interceptors.response.use(Http.transformResponse, Http.transformResponseError);
    }
    /**
     * Calculates and returns the User-Agent header
     * @param config
     */
    Http.getUserAgent = function (config) {
        var packages = config.packages || {};
        // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        var pkg = require('../package.json');
        packages[pkg.name] = pkg.version;
        var userAgent = [];
        if (flex_plugins_utils_env_1.env.isNode()) {
            userAgent.push("Node.js/" + process.version.slice(1), "(" + process.platform + "; " + process.arch + ")");
        }
        else {
            userAgent.push(window.navigator.userAgent);
        }
        if (config.caller) {
            userAgent.push("caller/" + config.caller);
        }
        Object.entries(packages).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return userAgent.push(key + "/" + value);
        });
        return userAgent.join(' ');
    };
    /**
     * Pretty prints a JSON object
     * @param obj
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    Http.prettyPrint = function (obj) {
        return JSON.stringify(obj, null, 2);
    };
    /**
     * Determines if the exception is a Twilio API response error
     * @param err
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Http.isTwilioError = function (err) {
        return Boolean(err && err.isAxiosError && err.response && err.response.data && err.response.data.more_info);
    };
    /**
     * Transforms the POST param if provided as object
     * @param req
     */
    Http.transformRequestFormData = function (req) {
        var _a;
        var method = req.method ? req.method : 'GET';
        flex_plugins_utils_logger_1.logger.debug("Making a " + method.toUpperCase() + " to " + req.baseURL + "/" + req.url);
        // Transform data to urlencoded
        if (method.toLocaleLowerCase() === 'post' &&
            ((_a = req.headers) === null || _a === void 0 ? void 0 : _a['Content-Type']) === Http.ContentType &&
            typeof req.data === 'object') {
            // This is formatting array of objects into a format Twilio Public API can consume
            var data = Object.keys(req.data).map(function (key) {
                var _a, _b;
                if (!Array.isArray(req.data[key])) {
                    return _a = {}, _a[key] = req.data[key], _a;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                var value = req.data[key].map(function (v) {
                    if (typeof v !== 'object') {
                        return v;
                    }
                    return JSON.stringify(v);
                });
                return _b = {}, _b[key] = value, _b;
            });
            req.data = qs_1.default.stringify(Object.assign.apply(Object, __spreadArray([{}], __read(data))), { encode: false, arrayFormat: 'repeat' });
        }
        return req;
    };
    Http.transformRequest = function (transformMethods) {
        return function (req) { return transformMethods.reduce(function (r, m) { return m(r); }, req); };
    };
    /**
     * Transforms the response object
     * @param resp
     */
    Http.transformResponse = function (resp) {
        var data = resp.data;
        var servedFromCache = resp.request.fromCache === true ? '(served from cache) ' : '';
        var pretty = Http.prettyPrint(data);
        var url = resp.config.baseURL + "/" + resp.config.url;
        var method = resp.request.method || '';
        flex_plugins_utils_logger_1.logger.debug(method + " request to " + url + " " + servedFromCache + "responded with statusCode " + resp.status + " and data\n" + pretty + "\n");
        return data;
    };
    /**
     * Transforms the rejection into a Twilio API Error if possible
     * @param err
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Http.transformResponseError = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                if (Http.isTwilioError(err)) {
                    data = err.response.data;
                    flex_plugins_utils_logger_1.logger.debug("Request errored with data\n" + Http.prettyPrint(data));
                    return [2 /*return*/, Promise.reject(new flex_plugins_utils_exception_1.TwilioApiError(data.code, data.message, data.status, data.more_info))];
                }
                flex_plugins_utils_logger_1.logger.debug("Request errored with message " + err.message);
                return [2 /*return*/, Promise.reject(err)];
            });
        });
    };
    /**
     * Makes a GET request
     * @param uri   the uri endpoint
     * @param option  the request option
     */
    Http.prototype.get = function (uri, option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.get(uri, this.getRequestOption(option))];
            });
        });
    };
    /**
     * Makes a POST request
     * @param uri   the uri of the endpoint
     * @param data  the data to post
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    Http.prototype.post = function (uri, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(uri, data)];
            });
        });
    };
    /**
     * Makes a delete request
     *
     * @param uri   the uri of the endpoint
     */
    Http.prototype.delete = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.delete(uri)];
            });
        });
    };
    /**
     * Returns a {@link AxiosRequestConfig} configuration
     * @param option  request configuration
     */
    Http.prototype.getRequestOption = function (option) {
        var opt = {};
        if (!option) {
            return opt;
        }
        if (option.cacheable) {
            opt.cache = {
                maxAge: option.cacheAge || this.cacheAge,
            };
        }
        return opt;
    };
    Http.ContentType = 'application/x-www-form-urlencoded';
    Http.UserAgent = 'User-Agent';
    return Http;
}());
exports.default = Http;
//# sourceMappingURL=http.js.map