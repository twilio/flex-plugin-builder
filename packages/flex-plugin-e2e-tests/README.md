![npm](https://img.shields.io/npm/v/flex-plugin-e2e-tests.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugin-e2e-tests.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-e2e-tests.svg?style=square)](../../LICENSE)

# Flex Plugin E2E Tests Suite

To be filled

### Prerequisites

Make sure that chromedriver is on your path and matches your chrome version

## Running Locally

To run locally:

```bash
# cd into this package
cd packages/flex-plugin-e2e-tests
npm run build

# This is the sandbox environment created to test CLI installation and to create plugin. Remove before re-running a test
rm -rf ~/.local
TWILIO_ACCOUNT_SID=ACxxx TWILIO_AUTH_TOKEN=123 PACKAGE_VERSION="4.7.5-beta.0" npm start
```

You can also run a specific step by using:

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
