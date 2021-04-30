"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("./http"));
var package_1 = require("../utils/package");
var BaseClient = /** @class */ (function () {
    function BaseClient(auth, baseUrl, options) {
        var config = {
            baseURL: baseUrl,
            userAgent: BaseClient.userAgent,
            auth: auth,
            exitOnRejection: true,
        };
        if (options && options.contentType) {
            config.contentType = options.contentType;
        }
        this.config = config;
        this.http = new http_1.default(this.config);
    }
    /**
     * Constructs user agent with core
     * plugin builder packages
     */
    BaseClient.getUserAgent = function (packages) {
        if (packages === void 0) { packages = package_1.FLEX_PACKAGES; }
        return package_1.getPackageDetails(packages)
            .reduce(function (userAgentString, pkg) { return userAgentString + " " + pkg.name + "/" + (pkg.found ? pkg.package.version : '?'); }, 'Flex Plugin Builder')
            .trimLeft();
    };
    BaseClient.userAgent = BaseClient.getUserAgent();
    BaseClient.realms = ['dev', 'stage'];
    /**
     * Returns the base URL
     */
    BaseClient.getBaseUrl = function (subDomain, version) {
        var realms = BaseClient.realms;
        var realm = process.env.REALM;
        if (realm && !realms.includes(realm)) {
            throw new Error("Invalid realm " + realm + " was provided. Realm must be one of " + realms.join(','));
        }
        var realmDomain = realm && realms.includes(realm) ? "." + realm.toLowerCase() : '';
        return "https://" + subDomain + realmDomain + ".twilio.com/" + version;
    };
    return BaseClient;
}());
exports.default = BaseClient;
//# sourceMappingURL=baseClient.js.map