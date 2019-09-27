(function(global, undefined) {
  'use strict';
  global.loadFlex = function loadFlex(targetEl) {
    Twilio.Flex.runDefault(appConfig, targetEl).catch(() => {
      throw new Error('Failed to authenticate user.');
    });
  };
})(typeof window !== 'undefined' ? window : this);
