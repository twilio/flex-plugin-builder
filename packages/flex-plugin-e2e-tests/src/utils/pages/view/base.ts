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
    await this.page.screenshot({ path: 'buddy-screenshot-1.png' });
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
