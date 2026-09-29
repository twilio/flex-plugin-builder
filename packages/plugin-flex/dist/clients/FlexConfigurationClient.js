"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
/**
 * Wrapper Twilio Flex Configuration Public API
 */
class FlexConfigurationClient {
    constructor(client, options) {
        /**
         * Creates a new {@link HttpClient}
         */
        this.createHttpClient = () => {
            return new flex_dev_utils_1.HttpClient(Object.assign(Object.assign({}, FlexConfigurationClient.HttpClientOption), { auth: {
                    username: this.options.username,
                    password: this.options.password,
                } }));
        };
        this.client = client;
        this.options = options;
    }
    /**
     * Fetches the {@link ConfigurationInstance}
     */
    async fetch() {
        const config = await this.client.fetch();
        if (!config.serverlessServiceSids) {
            config.serverlessServiceSids = [];
        }
        return config;
    }
    /**
     * Fetches the Serverless ServiceSid
     */
    async getServerlessSid() {
        const config = await this.fetch();
        return config.serverlessServiceSids[0];
    }
    /**
     * Registers Serverless sid
     * @param serviceSid the sid to register
     */
    async registerServerlessSid(serviceSid) {
        const config = await this.fetch();
        if (config.serverlessServiceSids.includes(serviceSid)) {
            return config;
        }
        config.serverlessServiceSids.push(serviceSid);
        await this.updateServerlessSids(config.serverlessServiceSids);
        return this.fetch();
    }
    /**
     * Removes a Serverless sid
     * @param serviceSid the sid to remove
     */
    async unregisterServerlessSid(serviceSid) {
        const config = await this.fetch();
        const index = config.serverlessServiceSids.indexOf(serviceSid);
        if (index === -1) {
            return config;
        }
        config.serverlessServiceSids.splice(index, 1);
        await this.updateServerlessSids(config.serverlessServiceSids);
        return this.fetch();
    }
    /**
     * Updates the serverless sids
     * @param sids  the serverless sid to update
     * @private
     */
    async updateServerlessSids(sids) {
        // eslint-disable-next-line camelcase
        const data = { account_sid: this.options.accountSid, serverless_service_sids: sids };
        const client = this.createHttpClient();
        try {
            await client.post('Configuration', data);
        }
        catch (e) {
            throw new flex_dev_utils_1.TwilioCliError(e);
        }
    }
}
exports.default = FlexConfigurationClient;
FlexConfigurationClient.HttpClientOption = {
    baseURL: 'https://flex-api.twilio.com/v1',
    supportProxy: true,
    json: true,
};
//# sourceMappingURL=FlexConfigurationClient.js.map