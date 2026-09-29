"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegion = exports.setRegion = exports.isDebug = exports.setDebug = exports.isTrace = exports.setCLI = exports.isCLI = exports.setQuiet = exports.isQuiet = exports.isTerminalPersisted = exports.persistTerminal = exports.getTwilioProfile = exports.setTwilioProfile = exports.isCI = exports.getWSSocket = exports.getWDSSocketPort = exports.setWDSSocketPort = exports.getWDSSocketPath = exports.setWDSSocketPath = exports.getWDSSocketHost = exports.setWDSSocketHost = exports.isHTTPS = exports.isLifecycle = exports.getLifecycle = exports.setBabelEnv = exports.getBabelEnv = exports.setNodeEnv = exports.getNodeEnv = exports.setFlexUISrc = exports.getFlexUISrc = exports.setPort = exports.getPort = exports.hasPort = exports.setHost = exports.getHost = exports.hasHost = exports.getAuthToken = exports.getAccountSid = exports.skipPreflightCheck = exports.setHttpProxy = exports.getHttpProxy = exports.hasHttpProxy = exports.getProcessEnv = exports.setProcessEnv = exports.isWin32 = exports.isNode = exports.Lifecycle = exports.Environment = void 0;
var lodash_get_1 = __importDefault(require("lodash.get"));
var flex_plugins_utils_exception_1 = require("@twilio/flex-plugins-utils-exception");
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
/* c8 ignore next */
var isNode = function () { return typeof process === 'object' && "" + process === '[object process]'; };
exports.isNode = isNode;
/* c8 ignore next */
var isWin32 = function () { return exports.isNode() && process.platform === 'win32'; };
exports.isWin32 = isWin32;
/**
 * Internal method for setting process.env
 * This is used to bypass terser library that does `process.env.FOO` string replacement
 * @param key the key to set
 * @param value the value set it to
 */
var setProcessEnv = function (key, value) {
    if (exports.isNode()) {
        process.env[key] = value;
    }
};
exports.setProcessEnv = setProcessEnv;
/**
 * Internal method for getting the process.env
 * @param key the key to get
 */
var getProcessEnv = function (key) { return process.env[key]; };
exports.getProcessEnv = getProcessEnv;
/**
 * Helper method to test whether env variable is defined
 * @param key the env to lookup
 * @return whether the key is set
 */
var isDefined = function (key) { return typeof key === 'string' && key !== ''; };
var setValidJSFile = function (source) {
    if (!source.endsWith('.js')) {
        throw new flex_plugins_utils_exception_1.TwilioError(source + " is not a valid JS file.");
    }
    exports.setProcessEnv('FLEX_UI_SRC', source);
};
/* c8 ignore next */
var hasHttpProxy = function () { return exports.isNode() && isDefined(exports.getProcessEnv('HTTP_PROXY')); };
exports.hasHttpProxy = hasHttpProxy;
var getHttpProxy = function () { return exports.getProcessEnv('HTTP_PROXY'); };
exports.getHttpProxy = getHttpProxy;
var setHttpProxy = function (host) { return exports.setProcessEnv('HTTP_PROXY', host); };
exports.setHttpProxy = setHttpProxy;
var skipPreflightCheck = function () { return exports.getProcessEnv('SKIP_PREFLIGHT_CHECK') === 'true'; };
exports.skipPreflightCheck = skipPreflightCheck;
var getAccountSid = function () { return exports.getProcessEnv('TWILIO_ACCOUNT_SID'); };
exports.getAccountSid = getAccountSid;
var getAuthToken = function () { return exports.getProcessEnv('TWILIO_AUTH_TOKEN'); };
exports.getAuthToken = getAuthToken;
var hasHost = function () { return isDefined(exports.getProcessEnv('HOST')); };
exports.hasHost = hasHost;
var getHost = function () { return exports.getProcessEnv('HOST'); };
exports.getHost = getHost;
var setHost = function (host) { return exports.setProcessEnv('HOST', host); };
exports.setHost = setHost;
var hasPort = function () { return isDefined(exports.getProcessEnv('PORT')); };
exports.hasPort = hasPort;
var getPort = function () { return Number(exports.getProcessEnv('PORT')); };
exports.getPort = getPort;
var setPort = function (port) { return exports.setProcessEnv('PORT', String(port)); };
exports.setPort = setPort;
var getFlexUISrc = function () { return exports.getProcessEnv('FLEX_UI_SRC'); };
exports.getFlexUISrc = getFlexUISrc;
var setFlexUISrc = function (source) { return setValidJSFile(source.toString()); };
exports.setFlexUISrc = setFlexUISrc;
var getNodeEnv = function () { return exports.getProcessEnv('NODE_ENV'); };
exports.getNodeEnv = getNodeEnv;
var setNodeEnv = function (_env) { return exports.setProcessEnv('NODE_ENV', _env); };
exports.setNodeEnv = setNodeEnv;
var getBabelEnv = function () { return exports.getProcessEnv('BABEL_ENV'); };
exports.getBabelEnv = getBabelEnv;
var setBabelEnv = function (_env) { return exports.setProcessEnv('BABEL_ENV', _env); };
exports.setBabelEnv = setBabelEnv;
var getLifecycle = function () { return exports.getProcessEnv('npm_lifecycle_event'); };
exports.getLifecycle = getLifecycle;
var isLifecycle = function (cycle) { return exports.getProcessEnv('npm_lifecycle_event') === cycle; };
exports.isLifecycle = isLifecycle;
var isHTTPS = function () { return exports.getProcessEnv('HTTPS') === 'true'; };
exports.isHTTPS = isHTTPS;
var setWDSSocketHost = function (host) { return exports.setProcessEnv('WDS_SOCKET_HOST', host); };
exports.setWDSSocketHost = setWDSSocketHost;
var getWDSSocketHost = function () { return exports.getProcessEnv('WDS_SOCKET_HOST'); };
exports.getWDSSocketHost = getWDSSocketHost;
var setWDSSocketPath = function (path) { return exports.setProcessEnv('WDS_SOCKET_PATH', path); };
exports.setWDSSocketPath = setWDSSocketPath;
var getWDSSocketPath = function () { return exports.getProcessEnv('WDS_SOCKET_PATH'); };
exports.getWDSSocketPath = getWDSSocketPath;
var setWDSSocketPort = function (port) { return exports.setProcessEnv('WDS_SOCKET_PORT', port.toString()); };
exports.setWDSSocketPort = setWDSSocketPort;
var getWDSSocketPort = function () { return Number(exports.getProcessEnv('WDS_SOCKET_PORT')); };
exports.getWDSSocketPort = getWDSSocketPort;
var getWSSocket = function () { return ({
    host: exports.getProcessEnv('WDS_SOCKET_HOST'),
    path: exports.getProcessEnv('WDS_SOCKET_PATH'),
    port: exports.getProcessEnv('WDS_SOCKET_PORT'),
}); };
exports.getWSSocket = getWSSocket;
/* c8 ignore next */
var isCI = function () { return exports.isNode() && exports.getProcessEnv('CI') === 'true'; };
exports.isCI = isCI;
/**
 * Sets the Twilio Profile
 * @param profile the profile to set
 */
var setTwilioProfile = function (profile) { return exports.setProcessEnv('TWILIO_PROFILE', profile); };
exports.setTwilioProfile = setTwilioProfile;
/**
 * Returns the Twilio Profile
 */
var getTwilioProfile = function () { return exports.getProcessEnv('TWILIO_PROFILE'); };
exports.getTwilioProfile = getTwilioProfile;
/**
 * Sets the environment to persist the terminal
 */
var persistTerminal = function () { return exports.setProcessEnv('PERSIST_TERMINAL', 'true'); };
exports.persistTerminal = persistTerminal;
/**
 * Determines if the terminal should be persisted or not
 */
var isTerminalPersisted = function () { return exports.isNode() && exports.getProcessEnv('PERSIST_TERMINAL') === 'true'; };
exports.isTerminalPersisted = isTerminalPersisted;
/**
 * Determines whether script should run in quiet mode
 */
var isQuiet = function () { return exports.isNode() && exports.getProcessEnv('QUIET') === 'true'; };
exports.isQuiet = isQuiet;
/**
 * Sets the quiet mode
 */
var setQuiet = function (isQuiet) {
    if (isQuiet === void 0) { isQuiet = true; }
    return exports.setProcessEnv('QUIET', String(isQuiet));
};
exports.setQuiet = setQuiet;
/**
 * Returns true if the caller is the CLI
 */
var isCLI = function () { return exports.getProcessEnv('FLEX_PLUGINS_CLI') === 'true'; };
exports.isCLI = isCLI;
/**
 * Sets the caller to be the CLI
 */
var setCLI = function () { return exports.setProcessEnv('FLEX_PLUGINS_CLI', 'true'); };
exports.setCLI = setCLI;
/**
 * Determines if log level should be trace level
 */
var isTrace = function () {
    if (exports.isNode()) {
        return exports.getProcessEnv('TRACE') === 'true';
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
    return exports.setProcessEnv('DEBUG', String(isDebug));
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
        return exports.getProcessEnv('DEBUG') === 'true';
    }
    if (window.Twilio) {
        return window.Twilio.Flex.Manager.getInstance().configuration.logLevel === 'debug';
    }
    return false;
};
exports.isDebug = isDebug;
/**
 * Sets the region
 */
var setRegion = function (region) { return exports.setProcessEnv('TWILIO_REGION', region); };
exports.setRegion = setRegion;
/**
 * Returns the region
 */
/* c8 ignore next */
var getRegion = function () {
    if (exports.isNode()) {
        return exports.getProcessEnv('TWILIO_REGION');
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
exports.getRegion = getRegion;
exports.default = {
    setProcessEnv: exports.setProcessEnv,
    getProcessEnv: exports.getProcessEnv,
    isNode: exports.isNode,
    isWin32: exports.isWin32,
    persistTerminal: exports.persistTerminal,
    hasHttpProxy: exports.hasHttpProxy,
    getHttpProxy: exports.getHttpProxy,
    skipPreflightCheck: exports.skipPreflightCheck,
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
    getRegion: exports.getRegion,
    setRegion: exports.setRegion,
    hasHost: exports.hasHost,
    getHost: exports.getHost,
    setHost: exports.setHost,
    hasPort: exports.hasPort,
    getPort: exports.getPort,
    setPort: exports.setPort,
    getFlexUISrc: exports.getFlexUISrc,
    setFlexUISrc: exports.setFlexUISrc,
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