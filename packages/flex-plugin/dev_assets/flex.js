(function(global, undefined) {
  'use strict';
  global.loadFlex = function loadFlex(targetEl) {
    const isAccountSidSet =
      typeof appConfig !== 'undefined' &&
      appConfig.sso &&
      appConfig.sso.accountSid;

    if (!isAccountSidSet) {
      console.error(
        'ERROR: You must have a valid appConfig with an accountSid set.'
      );
    } else {
      Twilio.Flex.runDefault(appConfig, targetEl).catch(() => {
        throw new Error('Failed to authenticate user.');
      });
    }
  };
})(typeof window !== 'undefined' ? window : this);
