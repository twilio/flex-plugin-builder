declare global {
	interface Window {
		appConfig?: {}
	}
}

declare const Twilio: {
	Flex: {
		Plugins: {
			init(FlexPlugin)
		}
	}
};
