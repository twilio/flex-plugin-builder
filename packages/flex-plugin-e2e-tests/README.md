![npm](https://img.shields.io/npm/v/flex-plugin-e2e-tests.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugin-e2e-tests.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-e2e-tests.svg?style=square)](../../LICENSE)

# Flex Plugin E2E Tests Suite

To be filled

### Prerequisites

Make sure that chromedriver is on your path and matches your Chrome version

## Create a new Test

To create a new test, use:

- `npm run create`: creates a new test
- `npm run create 5`: creates a test at step5 and then auto-increments all existing steps (i.e. step 5 -> 6, step 6-> 7, etc)

## Running Locally

To run locally:

```bash
# cd into this package
cd packages/flex-plugin-e2e-tests
npm run build

# This is the sandbox environment created to test CLI installation and to create plugin. Remove before re-running a test
rm -rf ~/.local
TWILIO_ACCOUNT_SID_drawin=ACxxx TWILIO_AUTH_TOKEN_darwin=123 CONSOLE_EMAIL="username@twilio.com" CONSOLE_PASSWORD="abc123" PACKAGE_VERSION="4.7.5-beta.0" npm start
```

You can also override certain defaults by setting these additional environment variables:

- `FLEX_UI_VERSION` - the flexUIVersion to use. Defaults to `^1` otherwise
- `PLUGIN_BASE_URL` - the baseUrl. Defaults to `http://localhost:3000` otherwise
- `TWILIO_REGION` - the twilio region to use

You can also run a specific step by using (don't forget the environment variables):

```bash
... npm start -- --step 2
```

To run multiple steps:

```bash
... npm start -- --step 2 --step 3 --step 10
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

[MIT](../../LICENSE)
