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
exports.FileVisibility = void 0;
/* eslint-disable camelcase */
var fs_1 = require("fs");
var path_1 = require("path");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var sids_1 = require("@twilio/flex-dev-utils/dist/sids");
var FileVisibility;
(function (FileVisibility) {
    FileVisibility["Public"] = "Public";
    FileVisibility["Protected"] = "Protected";
})(FileVisibility = exports.FileVisibility || (exports.FileVisibility = {}));
var FilesClient = /** @class */ (function () {
    function FilesClient(http, fileType, serviceSid) {
        var _this = this;
        /**
         * Uploads the provided filePath as a new {@link File}.
         * This endpoint creates a new {@link ServerlessFile}, a new {@link ServerlessFileVersion} for it, and then uploads the file to S3
         *
         * @param friendlyName  the friendlyName of the File
         * @param uri           the uri of the File
         * @param localFilePath the local path to the file
         * @param isProtected   whether to upload this file as Public or Protected
         */
        /* c8 ignore next */
        this.upload = function (friendlyName, uri, localFilePath, isProtected) {
            if (isProtected === void 0) { isProtected = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var file, contentConfig, form, baseURL, url;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._create(friendlyName)];
                        case 1:
                            file = _a.sent();
                            contentConfig = {
                                filename: path_1.basename(localFilePath),
                                contentType: FilesClient.getContentType(localFilePath),
                            };
                            form = new flex_dev_utils_1.FormData();
                            form.append('Path', uri);
                            form.append('Visibility', isProtected ? FileVisibility.Protected : FileVisibility.Public);
                            form.append('Content', fs_1.createReadStream(localFilePath), contentConfig);
                            baseURL = flex_dev_utils_1.HttpClient.getBaseUrl('https://serverless-upload.twilio.com/v1');
                            url = flex_dev_utils_1.urlJoin('Services', this.serviceSid, this.fileType, file.sid, 'Versions');
                            return [2 /*return*/, this.http.upload(url, form, { baseURL: baseURL })];
                    }
                });
            });
        };
        /**
         * Creates a new {@link File}
         * @param friendlyName  the friendly name of the file
         * @private
         */
        this._create = function (friendlyName) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = flex_dev_utils_1.urlJoin('Services', this.serviceSid, this.fileType);
                return [2 /*return*/, this.http.post(url, { FriendlyName: friendlyName })];
            });
        }); };
        if (!sids_1.isSidOfType(serviceSid, sids_1.SidPrefix.ServiceSid)) {
            throw new flex_dev_utils_1.TwilioCliError(serviceSid + " is not of type " + sids_1.SidPrefix.ServiceSid);
        }
        this.http = http;
        this.serviceSid = serviceSid;
        this.fileType = fileType;
    }
    FilesClient.ContentTypeApplicationJson = 'application/json';
    FilesClient.ContentTypeApplicationJavaScript = 'application/javascript';
    FilesClient.ContentTypeApplicationOctet = 'application/octet-stream';
    /**
     * Determines the content type based on file extension
     *
     * @param filePath  the local path to the file
     * @returns the content type
     */
    FilesClient.getContentType = function (filePath) {
        var ext = filePath.split('.').pop();
        if (ext === 'js') {
            return FilesClient.ContentTypeApplicationJavaScript;
        }
        else if (ext === 'map') {
            return FilesClient.ContentTypeApplicationJson;
        }
        return FilesClient.ContentTypeApplicationOctet;
    };
    return FilesClient;
}());
exports.default = FilesClient;
//# sourceMappingURL=files.js.map