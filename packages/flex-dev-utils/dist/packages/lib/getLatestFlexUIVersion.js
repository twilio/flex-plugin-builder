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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var semver_1 = __importDefault(require("semver"));
var getRegistryVersion_1 = __importDefault(require("./getRegistryVersion"));
/**
 * Returns the latest flex ui version for a given major
 * Will search through latest, beta, and alpha versions for a matching verion (in that order)
 * @param version the flex ui major version
 */
function getLatestFlexUIVersion(majorVersion) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var tags, tags_1, tags_1_1, tag, pkg, e_1_1;
        var e_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tags = ['latest', 'beta', 'alpha'];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    tags_1 = __values(tags), tags_1_1 = tags_1.next();
                    _c.label = 2;
                case 2:
                    if (!!tags_1_1.done) return [3 /*break*/, 5];
                    tag = tags_1_1.value;
                    return [4 /*yield*/, getRegistryVersion_1.default('@twilio/flex-ui', tag)];
                case 3:
                    pkg = _c.sent();
                    if (!pkg || !pkg.version) {
                        return [3 /*break*/, 4];
                    }
                    if (((_a = semver_1.default.coerce(pkg.version)) === null || _a === void 0 ? void 0 : _a.major) === majorVersion) {
                        return [2 /*return*/, pkg.version];
                    }
                    _c.label = 4;
                case 4:
                    tags_1_1 = tags_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (tags_1_1 && !tags_1_1.done && (_b = tags_1.return)) _b.call(tags_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: throw new Error("The major version you requested for flex ui (" + majorVersion + ") does not exist.");
            }
        });
    });
}
exports.default = getLatestFlexUIVersion;
//# sourceMappingURL=getLatestFlexUIVersion.js.map