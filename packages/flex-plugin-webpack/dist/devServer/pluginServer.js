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
exports._renderPluginServer = exports._fetchPluginsServer = exports._requestValidator = exports.combineJweToken = exports.splitTokenToChunks = exports._makeRequestToFlex = exports._getHeaders = exports._mergePlugins = exports._getRemoteVersionedPlugins = exports._getLocalPlugins = exports._getLocalPlugin = exports.JWE_TOKEN_LIMIT = exports.PLUGIN_INPUT_PARSER_REGEX = void 0;
var https_1 = __importDefault(require("https"));
var dns_1 = __importDefault(require("dns"));
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var prints_1 = require("../prints");
exports.PLUGIN_INPUT_PARSER_REGEX = /([\w-]+)(?:@(\S+))?/;
exports.JWE_TOKEN_LIMIT = 3900;
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
 * Returns versioned plugins from the CLI
 *
 * @param names
 * @returns
 */
var _getRemoteVersionedPlugins = function (names) {
    return names.map(function (plugin) {
        var groups = plugin.match(exports.PLUGIN_INPUT_PARSER_REGEX);
        if (!groups) {
            throw new flex_dev_utils_1.FlexPluginError('Unexpected plugin name format was provided');
        }
        var name = groups[1];
        var version = groups[2];
        return {
            phase: 3,
            name: name,
            src: "/plugins/v1/" + name + "/" + version + "/bundle.js",
            version: version,
        };
    });
};
exports._getRemoteVersionedPlugins = _getRemoteVersionedPlugins;
/**
 * Merge local and remote plugins
 * @param localPlugins   the list of local plugins
 * @param remotePlugins  the lost of remote plugins
 * @private
 */
// eslint-disable-next-line import/no-unused-modules
var _mergePlugins = function (localPlugins, remotePlugins, versionedPlugins) {
    var deduped = remotePlugins.filter(function (r) { return !localPlugins.some(function (l) { return l.name === r.name; }) && !versionedPlugins.some(function (l) { return l.name === r.name; }); });
    return __spreadArray(__spreadArray(__spreadArray([], __read(localPlugins)), __read(deduped)), __read(versionedPlugins));
};
exports._mergePlugins = _mergePlugins;
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
 * Forward the request to Flex to fetch the list of active plugins or render the plugin bundle
 * @param token JWE token
 * @param path Flex endpoint
 * @param version Flex UI Version
 * @returns Data returned by Flex
 * @private
 */
var _makeRequestToFlex = function (token, path, version) { return __awaiter(void 0, void 0, void 0, function () {
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
                    path: path,
                    method: 'GET',
                    headers: headers,
                };
                https_1.default
                    .request(options, function (res) {
                    var data = [];
                    res.on('data', function (chunk) { return data.push(chunk); });
                    res.on('end', function () {
                        resolve(Buffer.concat(data).toString());
                    });
                })
                    .on('error', reject)
                    .end();
            })];
    });
}); };
exports._makeRequestToFlex = _makeRequestToFlex;
/**
 * Split Large token to chunks
 * @param token JWE token
 * @param length chunk length
 * @returns Chunks of the token
 * @private
 */
var splitTokenToChunks = function (token, length) {
    if (length <= 0) {
        throw new flex_dev_utils_1.FlexPluginError('Token chunks Length must be a positive integer');
    }
    var tokenChunks = [];
    for (var i = 0; i < token.length; i += length) {
        var chunk = token.slice(i, i + length);
        tokenChunks.push(chunk);
    }
    return tokenChunks;
};
exports.splitTokenToChunks = splitTokenToChunks;
/**
 * Combine chunks to on JWE token
 * @param cookes request cookies
 * @param length chunk length
 * @returns JWE token
 * @private
 */
var combineJweToken = function (cookies) {
    var chunks = [];
    var key = 0;
    while (true) {
        var token = cookies["flex-jwe" + (key === 0 ? '' : "-" + (key + 1))];
        if (token === undefined) {
            break;
        }
        chunks.push(token);
        key += 1;
    }
    return chunks.join('');
};
exports.combineJweToken = combineJweToken;
/**
 * Common middleware that validates the request data
 */
var _requestValidator = function (req, res, next) {
    var headers = req.headers, method = req.method;
    // JWE token may be present in headers/cookies
    var jweToken = (headers['x-flex-jwe'] || req.cookies['flex-jwe']);
    var responseHeaders = exports._getHeaders();
    if (method === 'OPTIONS') {
        res.writeHead(200, responseHeaders);
        res.end();
        return;
    }
    if (method !== 'GET') {
        res.writeHead(404, responseHeaders);
        res.end('Route not found');
        return;
    }
    if (!jweToken) {
        flex_dev_utils_1.logger.debug('No JWE Token');
        res.writeHead(400, responseHeaders);
        res.end('No X-Flex-JWE was provided');
        return;
    }
    next();
};
exports._requestValidator = _requestValidator;
/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param plugins
 * @param config
 * @param onRemotePlugin
 */
// eslint-disable-next-line import/no-unused-modules, @typescript-eslint/explicit-module-boundary-types
var _fetchPluginsServer = function (plugins, config, onRemotePlugin) {
    return function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var headers, jweToken, flexVersion, responseHeaders, hasRemotePlugin, localPlugins, versionedPlugins, promise;
        return __generator(this, function (_a) {
            headers = req.headers;
            jweToken = headers['x-flex-jwe'];
            flexVersion = headers['x-flex-version'];
            responseHeaders = exports._getHeaders();
            hasRemotePlugin = config.remoteAll || plugins.remote.length !== 0;
            localPlugins = exports._getLocalPlugins(config.port, plugins.local);
            versionedPlugins = exports._getRemoteVersionedPlugins(plugins.versioned);
            promise = hasRemotePlugin
                ? exports._makeRequestToFlex(jweToken, '/plugins', flexVersion)
                : Promise.resolve('[]');
            // eslint-disable-next-line consistent-return
            return [2 /*return*/, (promise
                    .then(function (pluginsResponse) {
                    var filteredPlugins = JSON.parse(pluginsResponse).filter(function (p) { return p.phase >= 3; });
                    var pluginsList = filteredPlugins.map(function (p) {
                        var _a, _b;
                        return (__assign(__assign({}, p), { 
                            // Filter out the Flex endpoint without the base URL (https://flex.twilio.com) if it exists
                            src: ((_b = (_a = p.src) === null || _a === void 0 ? void 0 : _a.match(/^https.+flex\.twilio\.com(\/.+)$/)) === null || _b === void 0 ? void 0 : _b[1]) || p.src }));
                    });
                    if (config.remoteAll) {
                        return pluginsList;
                    }
                    // Check that all remote plugins inputted are valid
                    var notFoundPlugins = plugins.remote.filter(function (plgin) { return !pluginsList.find(function (r) { return r.name === plgin; }); });
                    if (notFoundPlugins.length) {
                        prints_1.remotePluginNotFound(notFoundPlugins, pluginsList);
                        flex_dev_utils_1.exit(1);
                    }
                    // Filter and only return the ones that are in remoteInputPlugins
                    return pluginsList.filter(function (r) { return plugins.remote.includes(r.name); });
                })
                    // rebase will eventually get both local and remote plugins
                    .then(function (remotePlugins) {
                    flex_dev_utils_1.logger.trace('Got remote plugins', remotePlugins);
                    onRemotePlugin(__spreadArray(__spreadArray([], __read(versionedPlugins)), __read(remotePlugins)));
                    var cookiesToSet = ["flex-jwe=" + jweToken];
                    if (jweToken.length > exports.JWE_TOKEN_LIMIT) {
                        var jweTokenChunks = exports.splitTokenToChunks(jweToken, exports.JWE_TOKEN_LIMIT);
                        flex_dev_utils_1.logger.debug("The JWE token is too long (" + jweToken.length + " characters). It will be split into " + jweTokenChunks.length + " chunks.");
                        cookiesToSet = jweTokenChunks.map(function (chunk, index) {
                            return "flex-jwe" + (index === 0 ? '' : "-" + (index + 1)) + "=" + chunk + ";";
                        });
                    }
                    res.writeHead(200, __assign(__assign({}, responseHeaders), { 
                        /*
                         * Set the JWE token in the cookies so that in the subsequent plugin rendering requests
                         * dev server can retrieve it to make the request to Flex.
                         */
                        'Set-Cookie': cookiesToSet }));
                    res.end(JSON.stringify(exports._mergePlugins(localPlugins, remotePlugins, versionedPlugins)));
                })
                    .catch(function (err) {
                    res.writeHead(500, responseHeaders);
                    res.end(err);
                }))];
        });
    }); };
};
exports._fetchPluginsServer = _fetchPluginsServer;
/**
 * Basic server to fetch plugin bundle content from Flex and return to the local dev-server
 */
var _renderPluginServer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jweToken, responseHeaders;
    return __generator(this, function (_a) {
        jweToken = exports.combineJweToken(req.cookies);
        responseHeaders = exports._getHeaders();
        flex_dev_utils_1.logger.debug("GET " + req.url);
        // eslint-disable-next-line consistent-return
        return [2 /*return*/, exports._makeRequestToFlex(jweToken, "/plugins/v1" + req.url)
                .then(function (pluginContent) {
                flex_dev_utils_1.logger.trace('Got remote plugin content', pluginContent);
                res.writeHead(200, responseHeaders);
                res.end(pluginContent);
            })
                .catch(function (err) {
                res.writeHead(500, responseHeaders);
                res.end(err);
            })];
    });
}); };
exports._renderPluginServer = _renderPluginServer;
/**
 * Setups up the plugin servers
 * @param plugins
 * @param webpackConfig
 * @param serverConfig
 */
/* c8 ignore next */
exports.default = (function (plugins, webpackConfig, serverConfig, onRemotePlugin, pluginsConfig) {
    dns_1.default.setDefaultResultOrder('ipv4first');
    serverConfig.port = webpackConfig.port || 3000;
    webpackConfig.proxy = plugins.local.reduce(function (proxy, name) {
        proxy["/plugins/" + name + ".js"] = {
            target: "http://127.0.0.1:" + serverConfig.port,
            router: function () {
                var match = pluginsConfig[name];
                if (!match) {
                    throw new Error();
                }
                return "http://127.0.0.1:" + match.port;
            },
        };
        return proxy;
    }, {});
    webpackConfig.setupMiddlewares = function (middlewares, server) {
        serverConfig.port = server.options.port || serverConfig.port;
        // @ts-ignore
        server.app.use(cookie_parser_1.default());
        // @ts-ignore
        server.app.use('^/plugins$', exports._requestValidator, exports._fetchPluginsServer(plugins, serverConfig, onRemotePlugin));
        // @ts-ignore
        server.app.use('^/plugins/v1/', exports._requestValidator, exports._renderPluginServer);
        return middlewares;
    };
});
//# sourceMappingURL=pluginServer.js.map