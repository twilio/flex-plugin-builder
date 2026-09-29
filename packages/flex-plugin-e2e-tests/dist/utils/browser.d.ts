import { App, BaseUrl } from './pages';
export declare class Browser {
    static app: App;
    private static _browser;
    private static _page;
    private static _domainsToInclude;
    /**
     * Initializes browser object
     */
    static create(baseUrls: BaseUrl): Promise<void>;
    static kill(): Promise<void>;
    /**
     * Attach browser log listener
     */
    private static _attachNetworkInterceptor;
    /**
     * Attach network interceptor
     */
    private static _attachLogListener;
}
