import { Logger } from 'flex-dev-utils';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';
declare const _default: (logger: Logger) => {
    deploySuccessful: (name: string, availability: string, deployedData: DeployResult) => void;
    warnHasLegacy: () => void;
};
export default _default;
