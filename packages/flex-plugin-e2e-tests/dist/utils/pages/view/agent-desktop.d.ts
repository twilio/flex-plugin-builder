import { ElementHandle, Page } from 'puppeteer';
import { Base } from './base';
export declare class AgentDesktop extends Base {
    private static readonly _noTaskCanvas;
    assert: {
        /**
         * Checks whether task canvas are visible on the Agent Desktop
         */
        isVisible: () => Promise<ElementHandle<Element | Node>>;
    };
    private readonly _baseUrl;
    constructor(page: Page, baseUrl: string);
    /**
     * Navigates to Agent Desktop
     */
    open(): Promise<void>;
}
