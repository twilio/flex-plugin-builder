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
exports.downloadRepo = exports.parseGitHubUrl = exports._downloadDir = exports._downloadFile = exports._hasTemplateDir = exports._getBaseRegex = exports.ERROR_BRANCH_MASTER_MAIN = exports.ERROR_GITHUB_URL_PARSE = exports.GitHubContentType = void 0;
/* eslint-disable camelcase */
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var axios_1 = __importDefault(require("flex-dev-utils/dist/axios"));
var fs_2 = require("flex-dev-utils/dist/fs");
var GitHubContentType;
(function (GitHubContentType) {
    GitHubContentType["File"] = "file";
    GitHubContentType["Dir"] = "dir";
})(GitHubContentType = exports.GitHubContentType || (exports.GitHubContentType = {}));
exports.ERROR_GITHUB_URL_PARSE = 'Could not get owner and repo name from GitHub URL';
exports.ERROR_BRANCH_MASTER_MAIN = 'Could not find branch main or master on GitHub';
/**
 * Generates a regex for matching the download url
 * @param info {GitHubInfo} the GitHub information
 * @param hasTemplateDir {boolean} whether the GitHub repo has a template directory
 * @private
 */
var _getBaseRegex = function (info, hasTemplateDir) {
    var baseRegex = "/" + info.owner + "/" + info.repo + "/" + info.ref + "/";
    if (hasTemplateDir) {
        return baseRegex + "template/";
    }
    return baseRegex;
};
exports._getBaseRegex = _getBaseRegex;
/**
 * Checks for back-ward compatible changes; returns true is the repo has a template/ directory
 * @param info {GitHubInfo}  the {@link GitHubInfo} information
 * @private
 */
var _hasTemplateDir = function (info) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        url = "https://api.github.com/repos/" + info.owner + "/" + info.repo + "/contents?ref=" + info.ref;
        return [2 /*return*/, axios_1.default
                .get(url)
                .then(function (resp) { return resp.data; })
                .then(function (contents) { return contents.some(function (content) { return content.name === 'template' && content.type === 'dir'; }); })];
    });
}); };
exports._hasTemplateDir = _hasTemplateDir;
/**
 * Downloads the file
 *
 * @param url {string}      the url of the file to download
 * @param output {string}   the output path
 * @private
 */
var _downloadFile = function (url, output) { return __awaiter(void 0, void 0, void 0, function () {
    var config, dir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = {
                    url: url,
                    responseType: 'arraybuffer',
                    method: 'GET',
                };
                dir = path_1.default.dirname(output);
                return [4 /*yield*/, fs_2.mkdirpSync(dir)];
            case 1:
                _a.sent();
                return [2 /*return*/, axios_1.default.request(config).then(function (result) { return fs_1.default.writeFileSync(output, result.data); })];
        }
    });
}); };
exports._downloadFile = _downloadFile;
/**
 * Recursively downloads the directory
 *
 * @param url {string}  the url to download
 * @param dir {string}  the path to the directory to save the content
 * @param baseRegex {String} the base path regex
 * @private
 */
var _downloadDir = function (url, dir, baseRegex) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, axios_1.default
                .get(url)
                .then(function (resp) { return resp.data; })
                .then(function (contents) { return __awaiter(void 0, void 0, void 0, function () {
                var promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = contents.map(function (content) { return __awaiter(void 0, void 0, void 0, function () {
                                var regex, relativePath, output;
                                return __generator(this, function (_a) {
                                    if (content.type === GitHubContentType.Dir) {
                                        return [2 /*return*/, exports._downloadDir(content.url, dir, baseRegex)];
                                    }
                                    if (content.type !== GitHubContentType.File) {
                                        throw new Error("Unexpected content type " + content.type);
                                    }
                                    regex = new RegExp(baseRegex + "(.+)\\??");
                                    relativePath = content.download_url.match(regex);
                                    if (!relativePath || relativePath.length !== 2) {
                                        throw new Error('Received invalid URL template');
                                    }
                                    output = path_1.default.resolve(dir, relativePath[1]);
                                    return [2 /*return*/, exports._downloadFile(content.download_url, output)];
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
exports._downloadDir = _downloadDir;
/**
 * Parses the GitHub URL to extract owner and repo information
 *
 * @param url {string}  the GitHub URL
 * @return returns the {@link GitHubInfo}
 */
var parseGitHubUrl = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var matches, info, branches, hasMaster, hasMain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                matches = url.match(/github\.com\/([0-9a-zA-Z-_]+)\/([0-9a-zA-Z-_]+)(\/tree\/([0-9a-zA-Z._-]+))?/);
                if (!matches || matches.length < 3) {
                    throw new Error(exports.ERROR_GITHUB_URL_PARSE);
                }
                info = {
                    owner: matches[1],
                    repo: matches[2],
                    ref: matches[4] || 'master',
                };
                if (!(info.ref === 'master' || info.ref === 'main')) return [3 /*break*/, 2];
                return [4 /*yield*/, axios_1.default
                        .get("https://api.github.com/repos/" + info.owner + "/" + info.repo + "/branches")
                        .then(function (resp) { return resp.data; })];
            case 1:
                branches = _a.sent();
                hasMaster = branches.find(function (branch) { return branch.name === 'master'; });
                hasMain = branches.find(function (branch) { return branch.name === 'main'; });
                if (hasMain) {
                    info.ref = 'main';
                }
                else if (hasMaster) {
                    info.ref = 'master';
                }
                else {
                    throw new Error(exports.ERROR_BRANCH_MASTER_MAIN);
                }
                _a.label = 2;
            case 2: return [2 /*return*/, info];
        }
    });
}); };
exports.parseGitHubUrl = parseGitHubUrl;
/**
 * Downloads the repo to the provided directory path
 *
 * @param info {GitHubInfo} the GitHub information
 * @param dir {string}      the directory to download the content to
 * @return null
 */
var downloadRepo = function (info, dir) { return __awaiter(void 0, void 0, void 0, function () {
    var hasTemplateDir, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports._hasTemplateDir(info)];
            case 1:
                hasTemplateDir = _a.sent();
                url = hasTemplateDir
                    ? "https://api.github.com/repos/" + info.owner + "/" + info.repo + "/contents/template?ref=" + info.ref
                    : "https://api.github.com/repos/" + info.owner + "/" + info.repo + "/contents?ref=" + info.ref;
                return [2 /*return*/, exports._downloadDir(url, dir, exports._getBaseRegex(info, hasTemplateDir))];
        }
    });
}); };
exports.downloadRepo = downloadRepo;
//# sourceMappingURL=github.js.map