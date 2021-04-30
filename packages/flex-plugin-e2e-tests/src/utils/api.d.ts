import { PluginVersionResource, PluginResource, ReleaseResource, ConfigurationResource, ConfiguredPluginResourcePage } from 'flex-plugins-api-client';
declare const _default: {
    cleanup: () => Promise<void>;
    getPluginVersion: (name: string, version: string) => Promise<PluginVersionResource>;
    getLatestPluginVersion: (name: string) => Promise<PluginVersionResource | null>;
    getPlugin: (name: string) => Promise<PluginResource>;
    getActiveRelease: () => Promise<ReleaseResource | null>;
    getConfiguration: (sid: string) => Promise<ConfigurationResource>;
    getActivePlugins: (sid: string) => Promise<ConfiguredPluginResourcePage>;
};
export default _default;
