(function(global, undefined) {
  'use strict';
  global.loadFlex = function loadFlex(targetEl) {
    if (
      typeof appConfig === 'undefined' ||
      !(appConfig.sso && appConfig.sso.accountSid) ||
      !appConfig.serviceBaseUrl
    ) {
      console.error(
        'ERROR: You must have a valid appConfig with both accountSid and serviceBaseUrl set.'
      );
    } else {
      Twilio.Flex.runDefault(appConfig, targetEl).catch(() => {
        throw new Error('Failed to authenticate user.');
      });
    }
  };
})(typeof window !== 'undefined' ? window : this);
