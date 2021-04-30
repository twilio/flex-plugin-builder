"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = require("querystring");
var util_1 = require("util");
var stream_1 = require("stream");
var axios_1 = __importStar(require("flex-dev-utils/dist/axios"));
var flex_dev_utils_1 = require("flex-dev-utils");
var applicationUrlEncoded = 'application/x-www-form-urlencoded';
var applicationJson = 'application/json';
var Http = /** @class */ (function () {
    function Http(config) {
        var _this = this;
        /**
         * Uploads the {@link FormData} to the URL
         *
         * @param url       the url to upload to
         * @param formData  the {@link FormData}
         */
        this.upload = function (url, formData) { return __awaiter(_this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        flex_dev_utils_1.logger.debug('Uploading formData to %s', url);
                        flex_dev_utils_1.logger.trace(formData);
                        return [4 /*yield*/, this.getUploadOptions(formData)];
                    case 1:
                        options = _a.sent();
                        return [2 /*return*/, axios_1.default
                                .post(url, formData, options)
                                .then(function (resp) { return resp.data; })
                                .catch(this.onError)];
                }
            });
        }); };
        /**
         * Create the upload configuration
         * @param formData
         */
        /* istanbul ignore next */
        this.getUploadOptions = function (formData) { return __awaiter(_this, void 0, void 0, function () {
            var options, length_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            headers: formData.getHeaders(),
                            auth: {
                                username: this.config.auth.username,
                                password: this.config.auth.password,
                            },
                        };
                        if (!flex_dev_utils_1.env.isDebug()) return [3 /*break*/, 2];
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
                                        flex_dev_utils_1.logger.debug("Uploading " + percentage.toFixed(1) + "% complete");
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
                                        axios_1.httpAdapter(config)
                                            // @ts-ignore
                                            .then(function (resp) { return axios_1.settle(resolve, reject, resp); })
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
         * Private error handler
         * @param err Axios error
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.onError = function (err) { return __awaiter(_this, void 0, void 0, function () {
            var request, resp, status_1, msg, title, errMsg;
            return __generator(this, function (_a) {
                flex_dev_utils_1.logger.trace('Http request failed', err);
                if (this.config.exitOnRejection) {
                    request = err.config || {};
                    resp = err.response || {};
                    status_1 = resp.status;
                    msg = (resp.data && resp.data.message) || resp.data;
                    title = 'Request %s to %s failed with status %s and message %s';
                    errMsg = util_1.format(title, request.method, request.url, status_1, msg);
                    throw new Error(errMsg);
                }
                else {
                    return [2 /*return*/, Promise.reject(err)];
                }
                return [2 /*return*/];
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
                                flex_dev_utils_1.logger.warning('Failed to calculate upload size');
                                resolve(-1);
                            }
                            else {
                                resolve(length);
                            }
                        });
                    })];
            });
        }); };
        this.config = config;
        this.jsonPOST = config.contentType === applicationJson;
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            auth: {
                username: config.auth.username,
                password: config.auth.password,
            },
            headers: {
                'Content-Type': config.contentType ? config.contentType : applicationUrlEncoded,
            },
        });
        if (config.userAgent) {
            this.client.defaults.headers['User-Agent'] = config.userAgent;
        }
        this.client.interceptors.response.use(function (r) { return r; }, this.onError);
    }
    /**
     * List API endpoint; makes a GET request and returns an array of R
     * @param uri   the uri endpoint
     */
    Http.prototype.list = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get(uri)];
            });
        });
    };
    /**
     * Makes a GET request to return an instance
     * @param uri   the uri endpoint
     */
    Http.prototype.get = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                flex_dev_utils_1.logger.debug('Making GET request to %s/%s', this.config.baseURL, uri);
                return [2 /*return*/, this.client.get(uri).then(function (resp) { return resp.data || {}; })];
            });
        });
    };
    /**
     * Makes a POST request
     * @param uri   the uri of the endpoint
     * @param data  the data to post
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    Http.prototype.post = function (uri, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                flex_dev_utils_1.logger.debug('Making POST request to %s/%s with data %s', this.config.baseURL, uri, JSON.stringify(data));
                if (!this.jsonPOST) {
                    data = querystring_1.stringify(data);
                }
                return [2 /*return*/, this.client.post(uri, data).then(function (resp) { return resp.data; })];
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
                flex_dev_utils_1.logger.debug('Making DELETE request to %s/%s', this.config.baseURL, uri);
                return [2 /*return*/, this.client.delete(uri)];
            });
        });
    };
    /**
     * Determines the content type based on file extension
     *
     * @param filePath  the local path to the file
     * @returns the content type
     */
    Http.getContentType = function (filePath) {
        var ext = filePath.split('.').pop();
        if (ext === 'js') {
            return 'application/javascript';
        }
        else if (ext === 'map') {
            return applicationJson;
        }
        return 'application/octet-stream';
    };
    return Http;
}());
exports.default = Http;
//# sourceMappingURL=http.js.map