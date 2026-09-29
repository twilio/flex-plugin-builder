import { Logger } from '@twilio/flex-dev-utils';
import { DeployResult } from '@twilio/flex-plugin-scripts/dist/scripts/deploy';
declare const _default: (logger: Logger) => {
    deploySuccessful: (name: string, availability: string, deployedData: DeployResult, profile: string | null) => void;
    warnHasLegacy: () => void;
};
export default _default;
