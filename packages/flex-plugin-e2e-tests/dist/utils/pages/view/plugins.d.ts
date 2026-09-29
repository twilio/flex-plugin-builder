import { ElementHandle, Page } from 'puppeteer';
import { Base } from './base';
interface PluginResponse {
    name: string;
    version: string;
    phase: number;
    src: string;
}
export declare class Plugins extends Base {
    private static readonly _pluginList;
    assert: {
        plugin: {
            /**
             * Checks whether plugin with the given text is visible in the UI
             * @param pluginText
             */
            isVisible: (pluginText: string) => Promise<ElementHandle<Element | Node>>;
        };
    };
    private readonly _baseUrl;
    constructor(page: Page, baseUrl: string);
    /**
     * Retrieves all plugins from /plugins
     */
    list(): Promise<PluginResponse[]>;
    /**
     * Creates selector for plugin based on its text
     */
    private _plugin;
}
export {};
