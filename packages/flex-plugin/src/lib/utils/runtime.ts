/**
 * Gets the Twilio Runtime URL
 * @return {string} the url of Twilio Runtime
 */
export const getRuntimeUrl = (): string => {
	if (document && document.currentScript) {
		const pluginScript = document.currentScript;

		if (typeof pluginScript['src'] === 'string') {
			const pluginUrl = (pluginScript as HTMLScriptElement).src;
			return pluginUrl.substr(0, pluginUrl.lastIndexOf('/'));
		}
	}

	return '';
};

/**
 * Gets the base URL for Twilio Runtime Assets
 * @return {string} the url of Assets
 */
export const getAssetsUrl = (): string => {
	const url = getRuntimeUrl();

	if (url && url !== '') {
		return `${url}/assets`;
	}

	return '';
};
