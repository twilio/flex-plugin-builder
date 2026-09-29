import { ConfiguredPluginResource } from '@twilio/flex-plugins-api-client';
import { TestScenario, PluginType } from '../core';
declare const _default: {
    waitForPluginToStart: (url: string, timeout: number, pollInterval: number) => Promise<void>;
    waitForPluginToRelease: (releasedPlugin: ConfiguredPluginResource, timeout: number, pollInterval: number) => Promise<void>;
    changeFlexUIVersionIfRequired: (scenario: TestScenario, plugin: PluginType) => void;
};
export default _default;
