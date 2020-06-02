const { TwilioError } = require('flex-plugins-utils-exception');

class TwilioCliError extends TwilioError {}

module.exports = TwilioCliError;
