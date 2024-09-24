import { logger } from '@twilio/flex-dev-utils';
import { ElementHandle, Page } from 'puppeteer';

export abstract class Base {
  protected static readonly DEFAULT_LOCATE_TIMEOUT = 3000000;

  protected static readonly DEFAULT_PAGE_LOAD_TIMEOUT = 3000000;

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
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const data = await this.page.goto(fullPath, {
          waitUntil: 'domcontentloaded',
          timeout: Base.DEFAULT_PAGE_LOAD_TIMEOUT,
        });
        logger.info('Page navigate', await data?.text());
        return; // Exit the function if the page loaded successfully
      } catch (error) {
        // eslint-disable-next-line no-plusplus
        attempts++;
        if (error instanceof Error) {
          logger.error(`Attempt ${attempts} failed. Error: ${error.message}`);
        } else {
          logger.error(`Attempt ${attempts} failed. Unknown error: ${error}`);
        }

        if (attempts < maxAttempts) {
          logger.info(`Retrying... Reloading the page (Attempt ${attempts})`);
          await this.page.reload({ waitUntil: 'domcontentloaded' });
        } else {
          logger.error('Maximum attempts reached. Failed to load the page.');
          throw new Error(`Failed to load page after ${maxAttempts} attempts.`);
        }
      }
    }
  }

  /**
   * Get text from an element
   * @param element
   * @param elementName
   */
  protected async getText(element: ElementHandle<Node>, elementName: string): Promise<string> {
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
  ): Promise<ElementHandle<Node | Element>> {
    const waitOptions = { timeout };

    let element: ElementHandle<Element | Node> | null;

    if (seletor.startsWith('//')) {
      element = await this.page.waitForXPath(seletor, waitOptions);
    } else {
      // @ts-ignore
      element = await this.page.waitForSelector(seletor, waitOptions);
    }

    if (!element) {
      throw new Error(`Element: ${elementName} is not visible in the UI`);
    }

    return element;
  }
}
