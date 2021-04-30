import { Logger } from 'flex-dev-utils';
declare const _default: (logger: Logger) => {
    upgradeNotification: (skip: boolean) => Promise<void>;
    scriptStarted: (version: string) => void;
    upgradeToLatest: () => void;
    scriptSucceeded: (needsInstall: boolean) => void;
    updatePluginUrl: (newline: boolean) => void;
    cannotRemoveCraco: (newline: boolean) => void;
    packageNotFound: (pkg: string) => void;
    notAvailable: (version?: number | undefined) => void;
    warnNotRemoved: (note: string) => void;
    removeLegacyNotification: (pluginName: string, skip: boolean) => Promise<void>;
    noLegacyPluginFound: (pluginName: string) => void;
    removeLegacyPluginSucceeded: (pluginName: string) => void;
    warningPluginNotInAPI: (pluginName: string) => void;
};
export default _default;
