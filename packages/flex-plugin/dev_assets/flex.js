const REDIRECT_KEY = 'LOCAL_FLEX_PLUGIN_LOGIN_REDIRECT';
const FIRST_LOAD_KEY = 'LOCAL_FLEX_PLUGIN_FIRST_LOAD';

function loadFlex() {
  if (
    typeof appConfig === 'undefined' ||
    !appConfig.sso.accountSid ||
    !appConfig.serviceBaseUrl
  ) {
    console.error(
      'ERROR: You must have a valid appConfig with both accountSid and serviceBaseUrl set.'
    );
  } else {
    const loginUrl = `http://www.twilio.com/service-login/flex/${appConfig.sso.accountSid || accountSid}?localPort=${window.location.port}`
    if (!localStorage.getItem(FIRST_LOAD_KEY)) {
      localStorage.setItem(FIRST_LOAD_KEY, 'redirected');
      window.location.replace(loginUrl);
      return;
    } else {
      Twilio.Flex.create(appConfig).then(flex => {
        localStorage.removeItem(REDIRECT_KEY);
        localStorage.removeItem(FIRST_LOAD_KEY);
        flex.init('#container');
      }).catch(err => {
        if (!localStorage.getItem(REDIRECT_KEY)) {
          localStorage.setItem(REDIRECT_KEY, 'redirected');
          window.location.replace(loginUrl);
        } else {
          throw new Error('Failed to authenticate user.');
        }
      });
    }

  }
}
