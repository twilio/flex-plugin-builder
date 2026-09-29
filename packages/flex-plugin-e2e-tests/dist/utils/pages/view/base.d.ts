import { ElementHandle, Page, PuppeteerLifeCycleEvent } from 'puppeteer';
export declare abstract class Base {
    protected static readonly DEFAULT_LOCATE_TIMEOUT = 3000000;
    protected static readonly DEFAULT_PAGE_LOAD_TIMEOUT = 3000000;
    protected readonly page: Page;
    constructor(page: Page);
    /**
     * Navigate to the given url
     * @param baseUrl
     * @param path
     */
    protected goto({ baseUrl, path, waitUntil, }: {
        baseUrl: string;
        path?: string;
        waitUntil?: PuppeteerLifeCycleEvent;
    }): Promise<void>;
    /**
     * Get text from an element
     * @param element
     * @param elementName
     */
    protected getText(element: ElementHandle<Node>, elementName: string): Promise<string>;
    /**
     * Input value into an element
     * @param element
     * @param value
     */
    protected inputText(selector: string, value: string): Promise<void>;
    /**
     * Click on an element
     * @param element
     */
    protected click(selector: string): Promise<void>;
    /**
     * Check that element exists and is visible
     * @param selector element which should be visible
     * @param elementName name of the searchable element
     * @param timeout time to wait for until element is visible in the UI
     */
    protected elementVisible(seletor: string, elementName: string, timeout?: number): Promise<ElementHandle<Node | Element>>;
}
