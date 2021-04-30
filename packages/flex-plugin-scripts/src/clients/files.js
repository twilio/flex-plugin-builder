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
var fs_1 = require("fs");
var path_1 = require("path");
var form_data_1 = __importDefault(require("form-data"));
var sids_1 = require("flex-dev-utils/dist/sids");
var baseClient_1 = __importDefault(require("./baseClient"));
var http_1 = __importDefault(require("./http"));
var serverless_types_1 = require("./serverless-types");
var services_1 = __importDefault(require("./services"));
var FilesClient = /** @class */ (function (_super) {
    __extends(FilesClient, _super);
    function FilesClient(auth, fileType, serviceSid) {
        var _this = _super.call(this, auth, services_1.default.getBaseUrl() + "/Services/" + serviceSid) || this;
        /**
         * Uploads the provided filePath as a new {@link File}.
         * This endpoint creates a new {@link File}, a new {@link Version} for it, and then uploads the file to S3
         *
         * @param friendlyName  the friendlyName of the File
         * @param uri           the uri of the File
         * @param localFilePath the local path to the file
         * @param isProtected   whether to upload this file as Public or Protected
         */
        /* istanbul ignore next */
        _this.upload = function (friendlyName, uri, localFilePath, isProtected) {
            if (isProtected === void 0) { isProtected = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var file, contentConfig, form, baseUrl, url;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._create(friendlyName)];
                        case 1:
                            file = _a.sent();
                            contentConfig = {
                                filename: path_1.basename(localFilePath),
                                contentType: http_1.default.getContentType(localFilePath),
                            };
                            form = new form_data_1.default();
                            form.append('Path', uri);
                            form.append('Visibility', isProtected ? serverless_types_1.FileVisibility.Protected : serverless_types_1.FileVisibility.Public);
                            form.append('Content', fs_1.createReadStream(localFilePath), contentConfig);
                            baseUrl = services_1.default.getBaseUrl('serverless-upload');
                            url = baseUrl + "/Services/" + this.serviceSid + "/" + this.fileType + "/" + file.sid + "/Versions";
                            return [2 /*return*/, this.http.upload(url, form)];
                    }
                });
            });
        };
        /**
         * Creates a new {@link File}
         * @param friendlyName  the friendly name of the file
         * @private
         */
        _this._create = function (friendlyName) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.http.post(this.fileType, { FriendlyName: friendlyName })];
            });
        }); };
        if (!sids_1.isSidOfType(serviceSid, 'ZS')) {
            throw new Error("ServiceSid " + serviceSid + " is not valid");
        }
        _this.fileType = fileType;
        _this.serviceSid = serviceSid;
        return _this;
    }
    return FilesClient;
}(baseClient_1.default));
exports.default = FilesClient;
//# sourceMappingURL=files.js.map