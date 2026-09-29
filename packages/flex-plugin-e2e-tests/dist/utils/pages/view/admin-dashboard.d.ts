import { ElementHandle, Page } from 'puppeteer';
import { Base } from './base';
export declare class AdminDashboard extends Base {
    private static readonly _adminDashboardSubHeader;
    assert: {
        /**
         * Checks whether Welcome Banner is visible on Admin Dashboard
         */
        isVisible: () => Promise<ElementHandle<Element | Node>>;
    };
    private readonly _baseUrl;
    constructor(page: Page, baseUrl: string);
    /**
     * Navigates to Admin Dashboard
     */
    open(): Promise<void>;
}
