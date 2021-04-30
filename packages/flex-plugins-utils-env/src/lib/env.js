"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealm = exports.setRealm = exports.isDebug = exports.setDebug = exports.isTrace = exports.setCLI = exports.isCLI = exports.setQuiet = exports.isQuiet = exports.isTerminalPersisted = exports.persistTerminal = exports.getTwilioProfile = exports.setTwilioProfile = exports.isCI = exports.isWin32 = exports.isNode = exports.getWSSocket = exports.getWDSSocketPort = exports.setWDSSocketPort = exports.getWDSSocketPath = exports.setWDSSocketPath = exports.getWDSSocketHost = exports.setWDSSocketHost = exports.isHTTPS = exports.isLifecycle = exports.getLifecycle = exports.setBabelEnv = exports.getBabelEnv = exports.setNodeEnv = exports.getNodeEnv = exports.setPort = exports.getPort = exports.hasPort = exports.setHost = exports.getHost = exports.hasHost = exports.getAuthToken = exports.getAccountSid = exports.allowUnbundledReact = exports.skipPreflightCheck = exports.Lifecycle = exports.Environment = void 0;
var lodash_get_1 = __importDefault(require("lodash.get"));
/* eslint-disable import/no-unused-modules */
var Environment;
(function (Environment) {
    Environment["Production"] = "production";
    Environment["Development"] = "development";
    Environment["Test"] = "test";
})(Environment = exports.Environment || (exports.Environment = {}));
var Lifecycle;
(function (Lifecycle) {
    Lifecycle["Test"] = "test";
    Lifecycle["Build"] = "build";
    Lifecycle["Prebuild"] = "prebuild";
    Lifecycle["Deploy"] = "deploy";
    Lifecycle["Predeploy"] = "predeploy";
})(Lifecycle = exports.Lifecycle || (exports.Lifecycle = {}));
/**
 * Helper method to test whether env variable is defined
 * @param key the env to lookup
 * @return whether the key is set
 */
var isDefined = function (key) { return typeof key === 'string' && key !== ''; };
/* istanbul ignore next */
var skipPreflightCheck = function () { return process.env.SKIP_PREFLIGHT_CHECK === 'true'; };
exports.skipPreflightCheck = skipPreflightCheck;
var allowUnbundledReact = function () { return process.env.UNBUNDLED_REACT === 'true'; };
exports.allowUnbundledReact = allowUnbundledReact;
var getAccountSid = function () { return process.env.TWILIO_ACCOUNT_SID; };
exports.getAccountSid = getAccountSid;
var getAuthToken = function () { return process.env.TWILIO_AUTH_TOKEN; };
exports.getAuthToken = getAuthToken;
var hasHost = function () { return isDefined(process.env.HOST); };
exports.hasHost = hasHost;
var getHost = function () { return process.env.HOST; };
exports.getHost = getHost;
var setHost = function (host) { return (process.env.HOST = host); };
exports.setHost = setHost;
var hasPort = function () { return isDefined(process.env.PORT); };
exports.hasPort = hasPort;
var getPort = function () { return Number(process.env.PORT); };
exports.getPort = getPort;
var setPort = function (port) { return (process.env.PORT = String(port)); };
exports.setPort = setPort;
var getNodeEnv = function () { return process.env.NODE_ENV; };
exports.getNodeEnv = getNodeEnv;
var setNodeEnv = function (_env) { return (process.env.NODE_ENV = _env); };
exports.setNodeEnv = setNodeEnv;
var getBabelEnv = function () { return process.env.BABEL_ENV; };
exports.getBabelEnv = getBabelEnv;
var setBabelEnv = function (_env) { return (process.env.BABEL_ENV = _env); };
exports.setBabelEnv = setBabelEnv;
var getLifecycle = function () { return process.env.npm_lifecycle_event; };
exports.getLifecycle = getLifecycle;
var isLifecycle = function (cycle) { return process.env.npm_lifecycle_event === cycle; };
exports.isLifecycle = isLifecycle;
var isHTTPS = function () { return process.env.HTTPS === 'true'; };
exports.isHTTPS = isHTTPS;
var setWDSSocketHost = function (host) { return (process.env.WDS_SOCKET_HOST = host); };
exports.setWDSSocketHost = setWDSSocketHost;
var getWDSSocketHost = function () { return process.env.WDS_SOCKET_HOST; };
exports.getWDSSocketHost = getWDSSocketHost;
var setWDSSocketPath = function (path) { return (process.env.WDS_SOCKET_PATH = path); };
exports.setWDSSocketPath = setWDSSocketPath;
var getWDSSocketPath = function () { return process.env.WDS_SOCKET_PATH; };
exports.getWDSSocketPath = getWDSSocketPath;
var setWDSSocketPort = function (port) { return (process.env.WDS_SOCKET_PORT = port.toString()); };
exports.setWDSSocketPort = setWDSSocketPort;
var getWDSSocketPort = function () { return Number(process.env.WDS_SOCKET_PORT); };
exports.getWDSSocketPort = getWDSSocketPort;
var getWSSocket = function () { return ({
    host: process.env.WDS_SOCKET_HOST,
    path: process.env.WDS_SOCKET_PATH,
    port: process.env.WDS_SOCKET_PORT,
}); };
exports.getWSSocket = getWSSocket;
/* istanbul ignore next */
var isNode = function () { return typeof process === 'object' && "" + process === '[object process]'; };
exports.isNode = isNode;
/* istanbul ignore next */
var isWin32 = function () { return exports.isNode() && process.platform === 'win32'; };
exports.isWin32 = isWin32;
/* istanbul ignore next */
var isCI = function () { return exports.isNode() && process.env.CI === 'true'; };
exports.isCI = isCI;
/**
 * Sets the Twilio Profile
 * @param profile the profile to set
 */
var setTwilioProfile = function (profile) {
    if (exports.isNode()) {
        process.env.TWILIO_PROFILE = profile;
    }
};
exports.setTwilioProfile = setTwilioProfile;
/**
 * Returns the Twilio Profile
 */
var getTwilioProfile = function () { return process.env.TWILIO_PROFILE; };
exports.getTwilioProfile = getTwilioProfile;
/**
 * Sets the environment to persist the terminal
 */
var persistTerminal = function () {
    if (exports.isNode()) {
        process.env.PERSIST_TERMINAL = 'true';
    }
};
exports.persistTerminal = persistTerminal;
/**
 * Determines if the terminal should be persisted or not
 */
var isTerminalPersisted = function () { return exports.isNode() && process.env.PERSIST_TERMINAL === 'true'; };
exports.isTerminalPersisted = isTerminalPersisted;
/**
 * Determines whether script should run in quiet mode
 */
var isQuiet = function () { return exports.isNode() && process.env.QUIET === 'true'; };
exports.isQuiet = isQuiet;
/**
 * Sets the quiet mode
 */
var setQuiet = function (isQuiet) {
    if (isQuiet === void 0) { isQuiet = true; }
    process.env.QUIET = String(isQuiet);
};
exports.setQuiet = setQuiet;
/**
 * Returns true if the caller is the CLI
 */
var isCLI = function () { return process.env.FLEX_PLUGINS_CLI === 'true'; };
exports.isCLI = isCLI;
/**
 * Sets the caller to be the CLI
 */
var setCLI = function () {
    process.env.FLEX_PLUGINS_CLI = 'true';
};
exports.setCLI = setCLI;
/**
 * Determines if log level should be trace level
 */
var isTrace = function () {
    if (exports.isNode()) {
        return process.env.TRACE === 'true';
    }
    if (window.Twilio) {
        return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'trace';
    }
    return false;
};
exports.isTrace = isTrace;
/**
 * Sets the debug mode
 */
var setDebug = function (isDebug) {
    if (isDebug === void 0) { isDebug = true; }
    if (exports.isNode()) {
        process.env.DEBUG = String(isDebug);
    }
};
exports.setDebug = setDebug;
/**
 * Returns true if running in debug verbose mode
 */
var isDebug = function () {
    if (exports.isTrace()) {
        return true;
    }
    if (exports.isNode()) {
        return process.env.DEBUG === 'true';
    }
    if (window.Twilio) {
        return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'debug';
    }
    return false;
};
exports.isDebug = isDebug;
/**
 * Sets the realm
 */
var setRealm = function (realm) {
    process.env.REALM = realm;
};
exports.setRealm = setRealm;
/**
 * Returns the realm
 */
/* istanbul ignore next */
var getRealm = function () {
    if (exports.isNode()) {
        return process.env.REALM;
    }
    if (window.Twilio) {
        var region = lodash_get_1.default(window.Twilio.Flex.Manager.getInstance(), 'configuration.sdkOptions.chat.region');
        if (region && region.indexOf('stage') !== -1) {
            return 'stage';
        }
        if (region && region.indexOf('dev') !== -1) {
            return 'dev';
        }
        return '';
    }
    var href = window.location.href;
    if (href && href.indexOf('flex.stage.twilio') !== -1) {
        return 'stage';
    }
    if (href && href.indexOf('flex.dev.twilio') !== -1) {
        return 'dev';
    }
    return '';
};
exports.getRealm = getRealm;
exports.default = {
    isNode: exports.isNode,
    isWin32: exports.isWin32,
    persistTerminal: exports.persistTerminal,
    skipPreflightCheck: exports.skipPreflightCheck,
    allowUnbundledReact: exports.allowUnbundledReact,
    isTerminalPersisted: exports.isTerminalPersisted,
    setTwilioProfile: exports.setTwilioProfile,
    getTwilioProfile: exports.getTwilioProfile,
    isQuiet: exports.isQuiet,
    setQuiet: exports.setQuiet,
    isCLI: exports.isCLI,
    setCLI: exports.setCLI,
    isCI: exports.isCI,
    setDebug: exports.setDebug,
    isDebug: exports.isDebug,
    isTrace: exports.isTrace,
    getAccountSid: exports.getAccountSid,
    getAuthToken: exports.getAuthToken,
    getRealm: exports.getRealm,
    setRealm: exports.setRealm,
    hasHost: exports.hasHost,
    getHost: exports.getHost,
    setHost: exports.setHost,
    hasPort: exports.hasPort,
    getPort: exports.getPort,
    setPort: exports.setPort,
    getNodeEnv: exports.getNodeEnv,
    setNodeEnv: exports.setNodeEnv,
    getBabelEnv: exports.getBabelEnv,
    setBabelEnv: exports.setBabelEnv,
    getLifecycle: exports.getLifecycle,
    isLifecycle: exports.isLifecycle,
    isHTTPS: exports.isHTTPS,
    getWDSSocketHost: exports.getWDSSocketHost,
    setWDSSocketHost: exports.setWDSSocketHost,
    getWDSSocketPath: exports.getWDSSocketPath,
    setWDSSocketPath: exports.setWDSSocketPath,
    setWDSSocketPort: exports.setWDSSocketPort,
    getWDSSocketPort: exports.getWDSSocketPort,
    getWSSocket: exports.getWSSocket,
};
//# sourceMappingURL=env.js.map