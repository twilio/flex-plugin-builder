let flexInstance = window.Twilio.Flex;
if (window.Twilio && window.Twilio.FlexProxy && window.Twilio.FlexProxy[__FPB_PLUGIN_UNIQUE_NAME]) {
  flexInstance = window.Twilio.FlexProxy[__FPB_PLUGIN_UNIQUE_NAME];
}
module.exports = flexInstance;
