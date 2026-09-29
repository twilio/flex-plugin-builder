import { Page } from 'puppeteer';
import { Base } from './base';
export declare class TwilioConsole extends Base {
    private static _loginForm;
    assert: {};
    private readonly _baseUrl;
    private readonly _flexBaseUrl;
    constructor(page: Page, { flex, twilioConsole }: {
        flex: string;
        twilioConsole: string;
    });
    /**
     * Creates a localhost url
     * @param port
     */
    private static _createLocalhostUrl;
    /**
     * Logs user in through service-login
     * @param flexPath
     * @param accountSid
     * @param localhostPort
     * @param firstLoad
     */
    login(flexPath: string, accountSid: string, localhostPort: number, firstLoad?: boolean): Promise<void>;
}
