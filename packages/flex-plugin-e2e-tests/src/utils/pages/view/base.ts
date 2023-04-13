import { ElementHandle, Page } from 'puppeteer';

export abstract class Base {
  protected static readonly DEFAULT_LOCATE_TIMEOUT = 60000;

  protected static readonly DEFAULT_PAGE_LOAD_TIMEOUT = 60000;

  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the given url
   * @param baseUrl
   * @param path
   */
  protected async goto({ baseUrl, path }: { baseUrl: string; path?: string }): Promise<void> {
    const fullPath = path ? `${baseUrl}/${path}` : baseUrl;
    await this.page.goto(fullPath, { waitUntil: 'load', timeout: 60000 });
  }

  /**
   * Get text from an element
   * @param element
   * @param elementName
   */
  protected async getText(element: ElementHandle<Element>, elementName: string): Promise<string> {
    const text = await element.evaluate((el) => el.textContent);

    if (!text) {
      throw new Error(`${elementName} does not contain any text`);
    }

    return text;
  }

  /**
   * Input value into an element
   * @param element
   * @param value
   */
  protected async inputText(selector: string, value: string): Promise<void> {
    const element = await this.elementVisible(selector, selector.substring(1));
    if (element) {
      await this.page.type(selector, value);
    } else {
      throw new Error('Something went wrong while entering value');
    }
  }

  /**
   * Click on an element
   * @param element
   */
  protected async click(selector: string): Promise<void> {
    const element = await this.elementVisible(selector, selector.substring(1));
    if (element) {
      await this.page.click(selector);
    } else {
      throw new Error('Something went wrong while clicking a button');
    }
  }

  /**
   * Check that element exists and is visible
   * @param selector element which should be visible
   * @param elementName name of the searchable element
   * @param timeout time to wait for until element is visible in the UI
   */
  protected async elementVisible(
    seletor: string,
    elementName: string,
    timeout = Base.DEFAULT_LOCATE_TIMEOUT,
  ): Promise<ElementHandle<Element>> {
    const waitOptions = { timeout };

    // Extremely naive check
    const element = seletor.startsWith('//')
      ? await this.page.waitForXPath(seletor, waitOptions)
      : await this.page.waitForSelector(seletor, waitOptions);

    if (!element) {
      throw new Error(`Element: ${elementName} is not visible in the UI`);
    }
    return element;
  }
}
