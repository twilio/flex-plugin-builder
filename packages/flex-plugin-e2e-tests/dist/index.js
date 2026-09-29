"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/prefer-for-of, global-require */
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var core_1 = require("./core");
core_1.runner(core_1.testParams, core_1.testScenarios)
    .then(function () {
    flex_dev_utils_1.logger.success('All E2E tests passed successfully');
})
    .catch(function (e) {
    flex_dev_utils_1.logger.error('Failed to run E2E tests');
    flex_dev_utils_1.logger.info(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
});
//# sourceMappingURL=index.js.map