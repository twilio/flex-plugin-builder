// your account sid
var accountSid = 'accountSid';

// your runtime domain
var serviceBaseUrl = 'runtimeUrl';

// set to /plugins.json for local dev
// set to /plugins.local.build.json for testing your build
// set to "" for the default live plugin loader
var pluginServiceUrl = '/plugins.json';

var appConfig = {
  serviceBaseUrl: serviceBaseUrl + '/',
  pluginService: {
    enabled: true,
    url: pluginServiceUrl,
  },
  sso: {
    accountSid: accountSid,
    tokenizerUrl: serviceBaseUrl + '/tokenizer',
  },
  ytica: false,
  logLevel: 'debug',
  showSupervisorDesktopView: true,
};
