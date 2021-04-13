interface Window {
  Twilio?: {
    Flex: {
      Manager: {
        getInstance(): {
          configuration: {
            logLevel: string;
            sdkOptions?: {
              chat?: {
                region?: string;
              };
            };
          };
        };
      };
    };
  };
}
