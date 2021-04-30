"use strict";
/* istanbul ignore file */
module.exports = {
    process: function () {
        return 'module.exports = {};';
    },
    getCacheKey: function () {
        // The output is always the same.
        return 'cssTransform';
    },
};
//# sourceMappingURL=css.js.map