"use strict";
/* eslint-disable camelcase */
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var stream_1 = require("stream");
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var qs_1 = __importDefault(require("qs"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var axios_cache_interceptor_1 = require("axios-cache-interceptor");
var https_proxy_agent_1 = require("https-proxy-agent");
var axios_1 = __importStar(require("axios"));
var flex_plugins_utils_exception_1 = require("@twilio/flex-plugins-utils-exception");
var env_1 = require("../../env");
var logger_1 = require("../../logger");
var lodash_1 = require("../../lodash");
var mkdirpSync = mkdirp_1.default.sync;
var writeFile = function (str) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    return fs_1.writeFileSync(path_1.default.join.apply(path_1.default, __spreadArray([], __read(paths))), str);
};
var Http = /** @class */ (function () {
    function Http(config) {
        var _this = this;
        /**
         * Create the upload configuration
         * @param formData
         */
        /* c8 ignore next */
        this.getUploadOptions = function (formData) { return __awaiter(_this, void 0, void 0, function () {
            var options, length_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.axiosConfig.auth) {
                            throw new flex_plugins_utils_exception_1.TwilioCliError("Authorization is required to upload a file");
                        }
                        options = {
                            headers: formData.getHeaders(),
                        };
                        options.headers['Content-Type'] = options.headers['content-type'];
                        if (!env_1.env.isDebug()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getFormDataSize(formData)];
                    case 1:
                        length_1 = _a.sent();
                        options.adapter = function (config) { return __awaiter(_this, void 0, void 0, function () {
                            var bytes, body, uploadReportStream;
                            return __generator(this, function (_a) {
                                bytes = 0;
                                body = config.data;
                                uploadReportStream = new stream_1.Transform({
                                    transform: function (chunk, _encoding, callback) {
                                        bytes += chunk.length;
                                        var percentage = (bytes / length_1) * 100;
                                        logger_1.logger.debug("Uploading " + percentage.toFixed(1) + "% complete");
                                        callback(undefined, chunk);
                                    },
                                });
                                if (typeof body.pipe === 'function') {
                                    body.pipe(uploadReportStream);
                                }
                                else {
                                    uploadReportStream.end(body);
                                }
                                config.data = uploadReportStream;
                                return [2 /*return*/, new Promise(function (resolve, reject) {
                                        var adapter = axios_1.getAdapter(axios_1.default.defaults.adapter); // fallback to default
                                        adapter(config)
                                            // @ts-ignore
                                            .then(function (resp) { return resolve(resp); })
                                            .catch(reject);
                                    })];
                            });
                        }); };
                        _a.label = 2;
                    case 2: return [2 /*return*/, options];
                }
            });
        }); };
        /**
         * Calculates the {@link FormData} size
         * @param formData the formData to calculate the size of
         */
        this.getFormDataSize = function (formData) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        formData.getLength(function (err, length) {
                            if (err) {
                                logger_1.logger.warning('Failed to calculate upload size');
                                resolve(-1);
                            }
                            else {
                                resolve(length);
                            }
                        });
                    })];
            });
        }); };
        /**
         * Setups a concurrency on the HTTP requests
         * @param req
         * @private
         */
        this.concurrencyRequestTransform = function (req) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var interval = setInterval(function () {
                            var _a = _this.concurrency, pending = _a.pending, max = _a.max;
                            logger_1.logger.debug('%s pending HTTP requests - max concurrent requests allowed is %s', pending, max);
                            if (pending < max) {
                                _this.incrementConcurrentRequests();
                                clearInterval(interval);
                                resolve(req);
                                return;
                            }
                            logger_1.logger.debug('Reached %s concurrent requests, waiting for requests to resolve', max);
                        }, Http.CONCURRENCY_REQUEST_LOOP_MS_DELAY);
                    })];
            });
        }); };
        /**
         * Transforms the response object
         * @param resp
         */
        this.transformResponse = function (resp) {
            _this.decrementConcurrentRequests();
            var data = resp.data;
            var servedFromCache = resp.cached === true ? '(served from cache) ' : '';
            var pretty = Http.prettyPrint(data);
            var url = resp.config.baseURL + "/" + resp.config.url;
            var method = resp.config.method || '';
            logger_1.logger.debug(method + " request to " + url + " " + servedFromCache + "responded with statusCode " + resp.status + " and data\n" + pretty + "\n");
            return data;
        };
        /**
         * Transforms the rejection into a Twilio API Error if possible
         * @param err
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.transformResponseError = function (err) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            var _a;
            return __generator(this, function (_b) {
                this.decrementConcurrentRequests();
                if (Http.isTwilioError(err)) {
                    data = err.response.data;
                    logger_1.logger.debug("Request errored with data\n" + Http.prettyPrint(data));
                    return [2 /*return*/, Promise.reject(new flex_plugins_utils_exception_1.TwilioApiError(data.code, data.message, data.status, data.more_info))];
                }
                logger_1.logger.debug("Request errored with message " + err.message);
                if ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) {
                    logger_1.logger.debug("Error: ", err.response.data);
                }
                return [2 /*return*/, Promise.reject(err)];
            });
        }); };
        /**
         * Increments concurrent request counter
         */
        this.incrementConcurrentRequests = function () {
            _this.concurrency.pending += 1;
        };
        /**
         * Decrements concurrent request counter
         */
        this.decrementConcurrentRequests = function () {
            _this.concurrency.pending = Math.max(0, _this.concurrency.pending - 1);
        };
        this.config = config;
        this.cacheAge = 15 * 60 * 1000;
        this.axiosConfig = {
            baseURL: Http.getBaseUrl(config.baseURL),
            headers: __assign({ 'Content-Type': config.json ? Http.ContentTypeApplicationJson : Http.ContentTypeUrlEncoded }, config.headers),
        };
        if (config.auth) {
            this.axiosConfig.auth = {
                username: config.auth.username,
                password: config.auth.password,
            };
        }
        if (config.setUserAgent) {
            /* c8 ignore next */
            if (!this.axiosConfig.headers) {
                this.axiosConfig.headers = {};
            }
            this.axiosConfig.headers[Http.UserAgent] = Http.getUserAgent(config);
        }
        // Set the Http Proxy if provided
        if (config.supportProxy && env_1.env.hasHttpProxy()) {
            this.axiosConfig.proxy = false;
            this.axiosConfig.httpsAgent = new https_proxy_agent_1.HttpsProxyAgent(env_1.env.getHttpProxy());
        }
        if (config.skipCacheSetup) {
            this.client = axios_1.default.create(this.axiosConfig);
        }
        else {
            this.client = axios_cache_interceptor_1.setupCache(axios_1.default.create(this.axiosConfig));
        }
        this.concurrency = {
            pending: 0,
            max: config.maxConcurrentRequests || Http.DEFAULT_CONCURRENT_REQUESTS,
        };
        this.client.interceptors.request.use(this.useRequestInterceptors([this.concurrencyRequestTransform, Http.transformRequestFormData].concat(config.requestInterceptors || [])));
        this.client.interceptors.response.use(this.transformResponse, this.transformResponseError);
    }
    /**
     * Creates an instance of the http client and calls the {@link #get} method.
     */
    /* c8 ignore next */
    Http.get = function (uri, option) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Http({ baseURL: '' }).get(uri, option)];
            });
        });
    };
    /**
     * Creates an instance of the http client and calls the {@link #post} method.
     */
    /* c8 ignore next */
    // eslint-disable-next-line @typescript-eslint/ban-types
    Http.post = function (uri, data, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Http({ baseURL: '' }).post(uri, data, options)];
            });
        });
    };
    /**
     * Creates an instance of the http client and calls the {@link #delete} method.
     */
    /* c8 ignore next */
    Http.delete = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Http({ baseURL: '' }).delete(uri)];
            });
        });
    };
    /**
     * Creates an instance of the http client and calls the {@link #upload} method.
     */
    /* c8 ignore next */
    Http.upload = function (uri, formData, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Http({ baseURL: '' }).upload(uri, formData, options)];
            });
        });
    };
    /**
     * Creates an instance of the http client and calls the {@link #download} method.
     */
    /* c8 ignore next */
    Http.download = function (url, directory, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Http({ baseURL: '' }).download(url, directory, config)];
            });
        });
    };
    /**
     * Appends the region to the baseUrl if it is twilio.com domain
     * @param baseUrl the baseUrl to use
     * @private
     */
    Http.getBaseUrl = function (baseUrl) {
        if (!baseUrl.includes('twilio.com')) {
            return baseUrl;
        }
        var region = env_1.env.getRegion();
        if (!region) {
            return baseUrl;
        }
        if (!Http.REGIONS.includes(region)) {
            throw new flex_plugins_utils_exception_1.TwilioCliError("Invalid region " + region + " was provided. Region must be one of " + Http.REGIONS.join(','));
        }
        // Base URL contains realm for eg. us1 which needs to replaced with dev-us1/stage-us1
        if (baseUrl.includes("." + Http.REALM + ".")) {
            region = region + "-" + Http.REALM;
        }
        Http.REGIONS.forEach(function (r) {
            baseUrl = baseUrl.replace("." + r + ".", '.');
        });
        return baseUrl.replace(new RegExp("([a-zA-z-]+)(?:." + Http.REALM + ")?.(twilio.com)"), "$1." + region + ".$2");
    };
    /**
     * Calculates and returns the User-Agent header
     * @param config
     */
    Http.getUserAgent = function (config) {
        var _a;
        var packages = config.packages || {};
        var userAgent = [];
        if (env_1.env.isNode()) {
            userAgent.push("Node.js/" + process.version.slice(1), "(" + process.platform + "; " + process.arch + ")");
            var shell = ((_a = process.env.SHELL) === null || _a === void 0 ? void 0 : _a.split('/').pop()) || 'unknown';
            userAgent.push("shell/" + shell);
            if (process.versions.yarn) {
                userAgent.push("yarn/" + process.versions.yarn);
            }
            if (process.versions.npm) {
                userAgent.push("npm/" + process.versions.npm);
            }
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
        userAgent.push("is_ci/" + env_1.env.isCI());
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
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var method, data;
            return __generator(this, function (_d) {
                method = req.method ? req.method : 'GET';
                logger_1.logger.debug("Making a " + method.toUpperCase() + " to " + req.baseURL + "/" + req.url);
                // Transform data to urlencoded
                if (method.toLocaleLowerCase() === 'post' &&
                    ((_a = req.headers) === null || _a === void 0 ? void 0 : _a['Content-Type']) === Http.ContentTypeUrlEncoded &&
                    typeof req.data === 'object') {
                    data = Object.keys(req.data).map(function (key) {
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
                    req.data = qs_1.default.stringify(Object.assign.apply(Object, __spreadArray([{}], __read(data))), {
                        encode: false,
                        arrayFormat: 'repeat',
                    });
                    logger_1.logger.debug("Request data " + req.data + " and content-type " + ((_b = req.headers) === null || _b === void 0 ? void 0 : _b['Content-Type']));
                }
                logger_1.logger.debug("Request data " + JSON.stringify(req.data) + " and content-type " + ((_c = req.headers) === null || _c === void 0 ? void 0 : _c['Content-Type']));
                return [2 /*return*/, Promise.resolve(req)];
            });
        });
    };
    /**
     * List API endpoint with pagination support
     * @param uri           the uri endpoint
     * @param responseKey  response key
     * @param pagination    the request option
     */
    Http.prototype.list = function (uri, responseKey, pagination) {
        return __awaiter(this, void 0, void 0, function () {
            var params, resp, next, prev, resultKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (pagination) {
                            Object.entries(pagination).forEach(function (_a) {
                                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                                return params.set(lodash_1.upperFirst(key), value);
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
    Http.prototype.post = function (uri, data, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(uri, data, options)];
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
     * Uploads the {@link FormData} to the URL
     *
     * @param uri       the url to upload to
     * @param formData  the {@link FormData}
     * @param options  the optional extra {@link AxiosRequestConfig} to pass
     */
    Http.prototype.upload = function (uri, formData, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = [{}];
                        return [4 /*yield*/, this.getUploadOptions(formData)];
                    case 1:
                        options = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), options]);
                        return [2 /*return*/, this.client.post(uri, formData, options)];
                }
            });
        });
    };
    /**
     * Downloads the file to the given directory
     * @param url the url of the file to download
     * @param directory the directory to download to
     * @param config optional {@link AxiosRequestConfig}
     */
    Http.prototype.download = function (url, directory, config) {
        return __awaiter(this, void 0, void 0, function () {
            var dir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.debug("Downloading " + url + " to " + directory);
                        config = __assign({ url: url, responseType: 'arraybuffer', method: 'GET' }, config);
                        dir = path_1.default.dirname(directory);
                        return [4 /*yield*/, mkdirpSync(dir)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.client.request(config).then(function (buffer) { return writeFile(buffer.toString(), directory); })];
                }
            });
        });
    };
    /**
     * Sets up all the request interceptors
     * @param interceptors the interceptors to setup
     * @private
     */
    Http.prototype.useRequestInterceptors = function (interceptors) {
        var _this = this;
        return function (req) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, interceptors.reduce(function (chain, current) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, chain.then(current)];
                    }); }); }, Promise.resolve(req))];
            });
        }); };
    };
    /**
     * Returns a {@link AxiosRequestConfig} configuration
     * @param option  request configuration
     */
    Http.prototype.getRequestOption = function (option) {
        var opt = {};
        opt.cache = false;
        if (!option) {
            return opt;
        }
        if (option.cacheable) {
            opt.cache = {
                ttl: option.cacheAge || this.cacheAge,
            };
        }
        return opt;
    };
    Http.DEFAULT_CONCURRENT_REQUESTS = 5;
    Http.CONCURRENCY_REQUEST_LOOP_MS_DELAY = 100;
    Http.REGIONS = ['dev', 'stage'];
    Http.UserAgent = 'User-Agent';
    Http.REALM = 'us1';
    Http.ContentTypeApplicationJson = 'application/json';
    Http.ContentTypeUrlEncoded = 'application/x-www-form-urlencoded';
    return Http;
}());
exports.default = Http;
//# sourceMappingURL=http.js.map