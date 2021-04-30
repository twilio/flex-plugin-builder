"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exit = exports.instanceOf = exports.createDescription = exports._runInformation = void 0;
exports._runInformation = 'This command needs to be invoked inside a plugin directory.';
/**
 * Creates the description for the command
 *
 * @param {string} description  the main description
 * @param {boolean} inDirectory  whether this command should be invoked inside a plugin directory or not
 * @returns {string} the updated command
 */
var createDescription = function (description, inDirectory) {
    if (inDirectory === void 0) { inDirectory = true; }
    description = description.trim().replace(/\.$/, '') + ".";
    if (!inDirectory) {
        return description;
    }
    return description + " " + exports._runInformation;
};
exports.createDescription = createDescription;
/**
 * Checks whether an object is instance of a given class
 * @param instance  the instance to check
 * @param klass     the class to check
 */
// eslint-disable-next-line @typescript-eslint/ban-types
var instanceOf = function (instance, klass) {
    // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
    while (instance && instance !== Object.prototype) {
        if (!instance || !instance.constructor || !instance.constructor.name) {
            return false;
        }
        if (klass.name === instance.constructor.name) {
            return true;
        }
        instance = Object.getPrototypeOf(instance);
    }
    return false;
};
exports.instanceOf = instanceOf;
/**
 * Exits the application
 * @param exitCode  the exit code
 */
var exit = function (exitCode) {
    if (exitCode === void 0) { exitCode = 1; }
    // eslint-disable-next-line no-process-exit
    process.exit(exitCode);
};
exports.exit = exit;
//# sourceMappingURL=general.js.map