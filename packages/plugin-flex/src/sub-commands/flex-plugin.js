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
var path_1 = require("path");
var os_1 = require("os");
var flex_plugins_api_toolkit_1 = __importDefault(require("flex-plugins-api-toolkit"));
var fs_1 = require("flex-dev-utils/dist/fs");
var cli_core_1 = require("@twilio/cli-core");
var flex_plugins_api_client_1 = require("flex-plugins-api-client");
var flex_dev_utils_1 = require("flex-dev-utils");
var dayjs_1 = __importDefault(require("dayjs"));
var Errors = __importStar(require("@oclif/errors"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var preload_1 = __importDefault(require("semver/preload"));
var parser_1 = __importDefault(require("../utils/parser"));
var flags = __importStar(require("../utils/flags"));
var general_1 = require("../utils/general");
var strings_1 = require("../utils/strings");
var prints_1 = __importDefault(require("../prints"));
var FlexConfigurationClient_1 = __importDefault(require("../clients/FlexConfigurationClient"));
var ServerlessClient_1 = __importDefault(require("../clients/ServerlessClient"));
var utils_1 = require("../utils");
var baseFlag = __assign({}, cli_core_1.baseCommands.TwilioClientCommand.flags);
delete baseFlag['cli-output-format'];
var packageJsonStr = 'package.json';
/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
var FlexPlugin = /** @class */ (function (_super) {
    __extends(FlexPlugin, _super);
    function FlexPlugin(argv, config, secureStorage, opts) {
        var _this = _super.call(this, argv, config, secureStorage) || this;
        _this.opts = __assign(__assign({}, FlexPlugin.defaultOptions), opts);
        _this.showHeaders = true;
        _this.cwd = process.cwd();
        _this.pluginRootDir = path_1.join(__dirname, '../../');
        _this.cliRootDir = path_1.join(os_1.homedir(), '.twilio-cli');
        _this.scriptArgs = process.argv.slice(3);
        _this.skipEnvironmentalSetup = false;
        _this._logger = new flex_dev_utils_1.Logger({ isQuiet: false, markdown: true });
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        _this.version = require(path_1.join(_this.pluginRootDir, packageJsonStr)).version;
        if (!_this.opts.strict) {
            // @ts-ignore
            _this.constructor.strict = false;
        }
        _this.exit = general_1.exit;
        return _this;
    }
    Object.defineProperty(FlexPlugin, "topic", {
        /**
         * Getter for the topic
         */
        get: function () {
            return utils_1.getTopic(this.topicName || '');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the version from the package.json if found, otherwise returns undefined
     * @param pkg
     */
    FlexPlugin.getPackageVersion = function (pkg) {
        try {
            // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
            return require(path_1.join(pkg, packageJsonStr)).version;
        }
        catch (e) {
            return 'undefined';
        }
    };
    /**
     * Returns the formatted header field
     * @param key
     */
    /* istanbul ignore next */
    FlexPlugin.getHeader = function (key) {
        return strings_1.toSentenceCase(key);
    };
    /**
     * Parses the timestamp
     * @param timestamp
     */
    /* istanbul ignore next */
    FlexPlugin.parseDate = function (timestamp) {
        return dayjs_1.default(timestamp).format('MMM DD, YYYY H:mm:ssA');
    };
    /**
     * Returns the formatted value field
     * @param key
     * @param value
     */
    /* istanbul ignore next */
    FlexPlugin.getValue = function (key, value) {
        key = key.toLowerCase();
        if (FlexPlugin.DATE_FIELDS.includes(key)) {
            return "..!!" + FlexPlugin.parseDate(value) + "!!..";
        }
        if (FlexPlugin.ACTIVE_FIELDS.includes(key)) {
            return value === true ? 'Active' : 'Inactive';
        }
        if (FlexPlugin.ACCESS_FIELDS.includes(key)) {
            return value === true ? 'Private' : 'Public';
        }
        return value;
    };
    /**
     * Checks the dir is a Flex plugin
     * @returns {boolean}
     */
    FlexPlugin.prototype.isPluginFolder = function () {
        if (!fs_1.checkAFileExists(this.cwd, packageJsonStr)) {
            return false;
        }
        var pkg = this.pkg;
        return ['@twilio/flex-ui'].every(function (dep) { return dep in pkg.dependencies || dep in pkg.devDependencies; });
    };
    Object.defineProperty(FlexPlugin.prototype, "pkg", {
        /**
         * Gets the package.json
         * @returns {object}
         */
        get: function () {
            var pkg = fs_1.readJsonFile(this.cwd, packageJsonStr);
            pkg.devDependencies = pkg.devDependencies || {};
            pkg.dependencies = pkg.dependencies || {};
            return pkg;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "builderVersion", {
        /**
         * Returns the major version of flex-plugin-scripts of the package
         */
        get: function () {
            var pkg = this.pkg;
            var script = pkg.dependencies['flex-plugin-scripts'] || pkg.devDependencies['flex-plugin-scripts'];
            if (!script) {
                return null;
            }
            var version = preload_1.default.coerce(script);
            if (!version) {
                return null;
            }
            return version.major;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "pluginsApiToolkit", {
        /**
         * Gets an instantiated {@link PluginsApiToolkit}
         * @returns {PluginsApiToolkit}
         */
        get: function () {
            if (!this._pluginsApiToolkit) {
                throw new flex_dev_utils_1.TwilioCliError('PluginsApiToolkit is not initialized yet');
            }
            return this._pluginsApiToolkit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "pluginsClient", {
        /**
         * Gets an instantiated {@link PluginsClient}
         * @returns {PluginsClient}
         */
        get: function () {
            if (!this._pluginsClient) {
                throw new flex_dev_utils_1.TwilioCliError('PluginsClient is not initialized yet');
            }
            return this._pluginsClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "pluginVersionsClient", {
        /**
         * Gets an instantiated {@link PluginsClient}
         * @returns {PluginsClient}
         */
        get: function () {
            if (!this._pluginVersionsClient) {
                throw new flex_dev_utils_1.TwilioCliError('PluginVersionsClient is not initialized yet');
            }
            return this._pluginVersionsClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "configurationsClient", {
        /**
         * Gets an instantiated {@link ConfigurationsClient}
         * @returns {ConfigurationsClient}
         */
        get: function () {
            if (!this._configurationsClient) {
                throw new flex_dev_utils_1.TwilioCliError('ConfigurationsClient is not initialized yet');
            }
            return this._configurationsClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "releasesClient", {
        /**
         * Gets an instantiated {@link ReleasesClient}
         * @returns {ReleasesClient}
         */
        get: function () {
            if (!this._releasesClient) {
                throw new flex_dev_utils_1.TwilioCliError('ReleasesClient is not initialized yet');
            }
            return this._releasesClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "flexConfigurationClient", {
        /**
         * Gets an instantiated {@link FlexConfigurationClient}
         * @returns {FlexConfigurationClient}
         */
        get: function () {
            if (!this._flexConfigurationClient) {
                throw new flex_dev_utils_1.TwilioCliError('flexConfigurationClient is not initialized yet');
            }
            return this._flexConfigurationClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "serverlessClient", {
        /**
         * Gets an instantiated {@link ServerlessClient}
         * @returns {ServerlessClient}
         */
        get: function () {
            if (!this._serverlessClient) {
                throw new flex_dev_utils_1.TwilioCliError('serverlessClient is not initialized yet');
            }
            return this._serverlessClient;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The main run command
     * @override
     */
    FlexPlugin.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pluginServiceOptions, flexConfigOptions, httpClient, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.run.call(this)];
                    case 1:
                        _a.sent();
                        this.logger.debug("Using Flex Plugins Config File: " + this.pluginsConfigPath);
                        if (this._flags['clear-terminal']) {
                            this._logger.clearTerminal();
                        }
                        if (this.opts.runInDirectory) {
                            if (!this.isPluginFolder()) {
                                throw new flex_dev_utils_1.TwilioCliError(this.cwd + " directory is not a flex plugin directory. You must either run a plugin inside a directory or use the --name flag");
                            }
                            if (this.checkCompatibility && this.builderVersion !== 4) {
                                this._prints.flexPlugin.incompatibleVersion(this.pkg.name, this.builderVersion);
                                this.exit(1);
                            }
                        }
                        pluginServiceOptions = {
                            setUserAgent: true,
                            caller: 'twilio-cli',
                            packages: {
                                'flex-plugin-scripts': FlexPlugin.getPackageVersion('flex-plugin-scripts'),
                                'flex-plugins-api-utils': FlexPlugin.getPackageVersion('flex-plugins-api-utils'),
                                'flex-plugins-api-client': FlexPlugin.getPackageVersion('flex-plugins-api-client'),
                                'twilio-cli': FlexPlugin.getPackageVersion('@twilio/cli-core'),
                                'twilio-cli-flex-plugin': FlexPlugin.getPackageVersion(this.pluginRootDir),
                            },
                        };
                        flexConfigOptions = {
                            accountSid: this.currentProfile.accountSid,
                            username: this.twilioApiClient.username,
                            password: this.twilioApiClient.password,
                        };
                        if (this._flags.region) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            pluginServiceOptions.realm = this._flags.region;
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            flexConfigOptions.realm = this._flags.region;
                        }
                        httpClient = new flex_plugins_api_client_1.PluginServiceHTTPClient(this.twilioApiClient.username, this.twilioApiClient.password, pluginServiceOptions);
                        this._pluginsApiToolkit = new flex_plugins_api_toolkit_1.default(this.twilioApiClient.username, this.twilioApiClient.password, pluginServiceOptions);
                        this._pluginsClient = new flex_plugins_api_client_1.PluginsClient(httpClient);
                        this._pluginVersionsClient = new flex_plugins_api_client_1.PluginVersionsClient(httpClient);
                        this._configurationsClient = new flex_plugins_api_client_1.ConfigurationsClient(httpClient);
                        this._releasesClient = new flex_plugins_api_client_1.ReleasesClient(httpClient);
                        this._flexConfigurationClient = new FlexConfigurationClient_1.default(this.twilioClient.flexApi.v1.configuration.get(), flexConfigOptions);
                        this._serverlessClient = new ServerlessClient_1.default(this.twilioClient.serverless.v1.services, this._logger);
                        if (!this.skipEnvironmentalSetup) {
                            this.setupEnvironment();
                        }
                        if (!this.isJson) {
                            this._logger.notice("Using profile **" + this.currentProfile.id + "** (" + this.currentProfile.accountSid + ")");
                            this._logger.newline();
                        }
                        return [4 /*yield*/, this.doRun()];
                    case 2:
                        result = _a.sent();
                        if (result && this.isJson && typeof result === 'object') {
                            this._logger.info(JSON.stringify(result));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Catches any thrown exception
     * @param error
     */
    FlexPlugin.prototype.catch = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (general_1.instanceOf(error, flex_dev_utils_1.TwilioError)) {
                    this._logger.error(error.message);
                }
                else if (general_1.instanceOf(error, Errors.CLIError)) {
                    Errors.error(error.message);
                }
                else {
                    _super.prototype.catch.call(this, error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * OClif alias for run command
     * @alias for run
     */
    /* istanbul ignore next */
    FlexPlugin.prototype.runCommand = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.run()];
            });
        });
    };
    /**
     * Runs a flex-plugin-scripts script
     * @param scriptName  the script name
     * @param argv        arguments to pass to the script
     */
    /* istanbul ignore next */
    FlexPlugin.prototype.runScript = function (scriptName, argv) {
        if (argv === void 0) { argv = this.scriptArgs; }
        return __awaiter(this, void 0, void 0, function () {
            var extra;
            var _a;
            return __generator(this, function (_b) {
                extra = [];
                if (scriptName !== 'test') {
                    extra.push('--core-cwd', this.pluginRootDir);
                    flex_dev_utils_1.env.setCLI();
                }
                // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
                return [2 /*return*/, (_a = require("flex-plugin-scripts/dist/scripts/" + scriptName)).default.apply(_a, __spreadArray(__spreadArray([], __read(argv)), __read(extra)))];
            });
        });
    };
    /**
     * Spawns a script
     * @param scriptName  the script to spawn
     * @param argv arguments to pass to the script
     */
    /* istanbul ignore next */
    // @ts-ignore
    FlexPlugin.prototype.spawnScript = function (scriptName, argv) {
        if (argv === void 0) { argv = this.scriptArgs; }
        return __awaiter(this, void 0, void 0, function () {
            var scriptPath;
            return __generator(this, function (_a) {
                scriptPath = require.resolve("flex-plugin-scripts/dist/scripts/" + scriptName);
                flex_dev_utils_1.env.setCLI();
                return [2 /*return*/, flex_dev_utils_1.spawn('node', __spreadArray(__spreadArray([scriptPath], __read(argv)), ['--run-script', '--core-cwd', this.pluginRootDir]))];
            });
        });
    };
    /**
     * Setups the environment. This must run after run command
     */
    FlexPlugin.prototype.setupEnvironment = function () {
        process.env.SKIP_CREDENTIALS_SAVING = 'true';
        process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
        process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;
        flex_dev_utils_1.env.setTwilioProfile(this.currentProfile.id);
        if (this._flags['cli-log-level'] === 'debug') {
            flex_dev_utils_1.env.setDebug();
            flex_dev_utils_1.env.persistTerminal();
        }
    };
    /**
     * Prints pretty an object as a Key:Value pair
     * @param object    the object to print
     * @param ignoreList  the keys in the object to ignore
     */
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FlexPlugin.prototype.printPretty = function (object) {
        var _this = this;
        var ignoreList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ignoreList[_i - 1] = arguments[_i];
        }
        Object.keys(object)
            .filter(function (key) { return !ignoreList.includes(key); })
            .forEach(function (key) {
            _this._logger.info("..\u2502.. [[" + strings_1.toSentenceCase(key) + "]]: " + FlexPlugin.getValue(key, object[key]));
        });
    };
    /**
     * Prints the key/value pair as a main header
     * @param key the key
     * @param value the value
     */
    /* istanbul ignore next */
    FlexPlugin.prototype.printHeader = function (key, value) {
        if (value === undefined) {
            this._logger.info("**[[" + FlexPlugin.getHeader(key) + ":]]**");
        }
        else {
            this._logger.info("**[[" + FlexPlugin.getHeader(key) + ":]]** " + FlexPlugin.getValue(key, value));
        }
    };
    /**
     * Prints the key/value as a "version" or instance header
     * @param key
     * @param otherKeys
     */
    /* istanbul ignore next */
    FlexPlugin.prototype.printVersion = function (key) {
        var otherKeys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherKeys[_i - 1] = arguments[_i];
        }
        if (otherKeys.length) {
            this._logger.info("**@@" + key + "@@** " + otherKeys.join(''));
        }
        else {
            this._logger.info("**@@" + key + "@@**");
        }
    };
    /**
     * Abstract class method that each command should extend; this is the actual command that runs once initialization is
     * complete
     * @abstract
     * @returns {Promise<void>}
     */
    /* istanbul ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FlexPlugin.prototype.doRun = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new flex_dev_utils_1.NotImplementedError();
            });
        });
    };
    Object.defineProperty(FlexPlugin.prototype, "checkCompatibility", {
        /**
         * Requires a check of compatibility
         */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "_flags", {
        /**
         * Abstract method for getting the flags
         * @protected
         */
        get: function () {
            return this.parse(FlexPlugin).flags;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "isJson", {
        /**
         * Whether this is a JSON response
         */
        get: function () {
            return this._flags.json;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "pluginsConfig", {
        /**
         * Get the cli plugin configuration
         */
        get: function () {
            mkdirp_1.default.sync(path_1.join(this.cliRootDir, 'flex'));
            if (!fs_1.checkAFileExists(this.pluginsConfigPath)) {
                fs_1.writeJSONFile({ plugins: [] }, this.pluginsConfigPath);
            }
            return fs_1.readJsonFile(this.pluginsConfigPath);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "pluginsConfigPath", {
        /**
         * Returns the pluginsConfigPath
         */
        get: function () {
            return path_1.join(this.cliRootDir, 'flex', 'plugins.json');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPlugin.prototype, "_prints", {
        /**
         * Configures the success/error print messages
         */
        get: function () {
            return prints_1.default(this._logger);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The command parse override
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FlexPlugin.prototype.parse = function (options, argv) {
        if (argv === void 0) { argv = this.argv; }
        return parser_1.default(_super.prototype.parse)(options, argv);
    };
    FlexPlugin.topicName = 'flex:plugins';
    FlexPlugin.flags = __assign(__assign({}, baseFlag), { json: flags.boolean({
            description: FlexPlugin.topic.flags.json,
        }), 'clear-terminal': flags.boolean({
            description: FlexPlugin.topic.flags.clearTerminal,
        }), region: flags.enum({
            options: ['dev', 'stage'],
            default: process.env.TWILIO_REGION,
            hidden: true,
        }) });
    FlexPlugin.DATE_FIELDS = ['datecreated', 'dateupdated', 'created', 'updated'];
    FlexPlugin.ACTIVE_FIELDS = ['active', 'isactive', 'status'];
    FlexPlugin.ACCESS_FIELDS = ['private', 'isprivate'];
    FlexPlugin.defaultOptions = {
        strict: true,
        runInDirectory: true,
    };
    return FlexPlugin;
}(cli_core_1.baseCommands.TwilioClientCommand));
exports.default = FlexPlugin;
//# sourceMappingURL=flex-plugin.js.map