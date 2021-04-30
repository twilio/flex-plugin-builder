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
exports._startServer = exports._mergePlugins = exports._getRemotePlugins = exports._getHeaders = exports._getLocalPlugins = exports._getLocalPlugin = void 0;
var https_1 = __importDefault(require("https"));
var flex_dev_utils_1 = require("flex-dev-utils");
var fs_1 = require("flex-dev-utils/dist/fs");
var prints_1 = require("../prints");
/**
 * Returns the plugin from the local configuration file
 * @param name  the plugin name
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getLocalPlugin = function (name) {
    return fs_1.readPluginsJson().plugins.find(function (p) { return p.name === name; });
};
exports._getLocalPlugin = _getLocalPlugin;
/**
 * Returns local plugins from  cli/plugins.json
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getLocalPlugins = function (port, names) {
    var protocol = "http" + (flex_dev_utils_1.env.isHTTPS() ? 's' : '') + "://";
    return names.map(function (name) {
        var match = exports._getLocalPlugin(name);
        if (match) {
            return {
                phase: 3,
                name: name,
                src: protocol + "localhost:" + port + "/plugins/" + name + ".js",
            };
        }
        throw new flex_dev_utils_1.FlexPluginError("The plugin " + name + " was not locally found. Try running `npm install` once in the plugin directory and try again.");
    });
};
exports._getLocalPlugins = _getLocalPlugins;
/**
 * Generates the response headers
 *
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _getHeaders = function () { return ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type, X-Flex-Version, X-Flex-JWE',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
}); };
exports._getHeaders = _getHeaders;
/**
 * Fetches the Plugins from Flex
 *
 * @param token     the JWE Token
 * @param version   the Flex version
 */
/* istanbul ignore next */
// eslint-disable-next-line import/no-unused-modules
var _getRemotePlugins = function (token, version) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var headers = {
                    'X-Flex-JWE': token,
                };
                if (version) {
                    headers['X-Flex-Version'] = version;
                }
                var options = {
                    hostname: 'flex.twilio.com',
                    port: 443,
                    path: '/plugins',
                    method: 'GET',
                    headers: headers,
                };
                https_1.default
                    .request(options, function (res) {
                    var data = [];
                    res.on('data', function (chunk) { return data.push(chunk); });
                    res.on('end', function () { return resolve(JSON.parse(Buffer.concat(data).toString()).filter(function (p) { return p.phase >= 3; })); });
                })
                    .on('error', reject)
                    .end();
            })];
    });
}); };
exports._getRemotePlugins = _getRemotePlugins;
/**
 * Merge local and remote plugins
 * @param localPlugins   the list of local plugins
 * @param remotePlugins  the lost of remote plugins
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _mergePlugins = function (localPlugins, remotePlugins) {
    var deduped = remotePlugins.filter(function (r) { return !localPlugins.some(function (l) { return l.name === r.name; }); });
    return __spreadArray(__spreadArray([], __read(localPlugins)), __read(deduped));
};
exports._mergePlugins = _mergePlugins;
/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param plugins
 * @param config
 * @param onRemotePlugin
 */
// eslint-disable-next-line import/no-unused-modules, @typescript-eslint/explicit-module-boundary-types
var _startServer = function (plugins, config, onRemotePlugin) {
    var responseHeaders = exports._getHeaders();
    return function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var headers, method, jweToken, flexVersion, hasRemotePlugin, localPlugins, promise;
        return __generator(this, function (_a) {
            headers = req.headers, method = req.method;
            if (method === 'OPTIONS') {
                res.writeHead(200, responseHeaders);
                return [2 /*return*/, res.end()];
            }
            if (method !== 'GET') {
                res.writeHead(404, responseHeaders);
                return [2 /*return*/, res.end('Route not found')];
            }
            flex_dev_utils_1.logger.debug('GET /plugins');
            jweToken = headers['x-flex-jwe'];
            flexVersion = headers['x-flex-version'];
            if (!jweToken) {
                res.writeHead(400, responseHeaders);
                return [2 /*return*/, res.end('No X-Flex-JWE was provided')];
            }
            hasRemotePlugin = config.remoteAll || plugins.remote.length !== 0;
            localPlugins = exports._getLocalPlugins(config.port, plugins.local);
            promise = hasRemotePlugin ? exports._getRemotePlugins(jweToken, flexVersion) : Promise.resolve([]);
            return [2 /*return*/, (promise
                    .then(function (remotePlugins) {
                    if (config.remoteAll) {
                        return remotePlugins;
                    }
                    // Check that all remote plugins inputted are valid
                    var notFoundPlugins = plugins.remote.filter(function (plgin) { return !remotePlugins.find(function (r) { return r.name === plgin; }); });
                    if (notFoundPlugins.length) {
                        prints_1.remotePluginNotFound(notFoundPlugins, remotePlugins);
                        flex_dev_utils_1.exit(1);
                    }
                    // Filter and only return the ones that are in remoteInputPlugins
                    return remotePlugins.filter(function (r) { return plugins.remote.includes(r.name); });
                })
                    // rebase will eventually get both local and remote plugins
                    .then(function (remotePlugins) {
                    flex_dev_utils_1.logger.trace('Got remote plugins', remotePlugins);
                    onRemotePlugin(remotePlugins);
                    res.writeHead(200, responseHeaders);
                    res.end(JSON.stringify(exports._mergePlugins(localPlugins, remotePlugins)));
                })
                    .catch(function (err) {
                    res.writeHead(500, responseHeaders);
                    res.end(err);
                }))];
        });
    }); };
};
exports._startServer = _startServer;
/**
 * Setups up the plugin servers
 * @param plugins
 * @param webpackConfig
 * @param serverConfig
 */
/* istanbul ignore next */
exports.default = (function (plugins, webpackConfig, serverConfig, onRemotePlugin) {
    serverConfig.port = webpackConfig.port || 3000;
    webpackConfig.proxy = plugins.local.reduce(function (proxy, name) {
        proxy["/plugins/" + name + ".js"] = {
            target: "http://localhost:" + serverConfig.port,
            router: function () {
                var match = exports._getLocalPlugin(name);
                if (!match) {
                    throw new Error();
                }
                return "http://localhost:" + match.port;
            },
        };
        return proxy;
    }, {});
    webpackConfig.before = function (app, server) {
        // @ts-ignore
        serverConfig.port = server.options.port || serverConfig.port;
        app.use('^/plugins$', exports._startServer(plugins, serverConfig, onRemotePlugin));
    };
});
//# sourceMappingURL=pluginServer.js.map