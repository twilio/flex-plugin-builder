import { Page } from 'puppeteer';
import { AdminDashboard } from './view/admin-dashboard';
import { AgentDesktop } from './view/agent-desktop';
import { Plugins } from './view/plugins';
import { TwilioConsole } from './view/twilio-console';
export interface BaseUrl {
    flex: string;
    twilioConsole: string;
}
export declare class App {
    assert: {
        agentDesktop: InstanceType<typeof AgentDesktop>['assert'];
        adminDashboard: InstanceType<typeof AdminDashboard>['assert'];
        twilioConsole: InstanceType<typeof TwilioConsole>['assert'];
        plugins: InstanceType<typeof Plugins>['assert'];
    };
    private readonly _agentDesktop;
    private readonly _adminDashboard;
    private readonly _twilioConsole;
    private readonly _plugins;
    private readonly _page;
    constructor(page: Page, { flex, twilioConsole }: BaseUrl);
    get agentDesktop(): Omit<AgentDesktop, 'assert'>;
    get adminDashboard(): Omit<AdminDashboard, 'assert'>;
    get plugins(): Omit<Plugins, 'assert'>;
    get twilioConsole(): Omit<TwilioConsole, 'assert'>;
    /**
     * Gets account sid from browser's console
     */
    getFlexAccountSid(): Promise<string>;
    /**
     * Takes screenshot of the current page
     * @param rootDir
     * @param screenshotName
     */
    takeScreenshot(rootDir: string, screenshotName?: string): Promise<void>;
}
