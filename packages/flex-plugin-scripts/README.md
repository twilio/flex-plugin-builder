![npm](https://img.shields.io/npm/v/flex-plugin-scripts.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/flex-plugin-scripts.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-scripts.svg?style=flat-square)](LICENSE.md)

# Flex Plugin Scripts

Scripts to run, build, and deploy Flex plugin.

## Installation

This repo will automatically be installed as part of creating a new plugin.

## Scripts

### Deploy
<!-- docs-generator:include('./docs/deploy.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `deploy` script is used to build and deploy your Flex plugin directly to Twilio Assets using the Serverless API.

Usage:
    `npm run deploy -- {options}`

The script will build and deploy your plugin to Twilio Assets using Serverless API. Please note that your AccountSid and AuthToken are required to use this script.

#### Options

**--public**

By default, plugins are uploaded as Private plugin. A plugin can be uploaded as Public by setting the `--public` flag:

```bash
npm run deploy -- --public
```

<!-- docs-generator:end - Do not remove or modify this section -->

### Build
<!-- docs-generator:include('./docs/build.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `build` script bundles your plugin into a single minified JavaScript file.

Usage:
    `npm run build`

<!-- docs-generator:end - Do not remove or modify this section -->

### Test
<!-- docs-generator:include('./docs/test.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `test` scripts run your unit tests using `jest`.

Usage:
    `npm run test`

<!-- docs-generator:end - Do not remove or modify this section -->

### Start
<!-- docs-generator:include('./docs/start.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `start` scripts sets up the sever locally so you develop your Flex plugin in real-time.

Usage:
    `npm run start`

#### Changing server port

By the default, the script will try to start a server on port 3000, or the first available port larger than 3000. You can provide a custom port using the `PORT` environmental variable:

```bash
PORT=4000 npm run start
```

<!-- docs-generator:end - Do not remove or modify this section -->

### Clear
<!-- docs-generator:include('./docs/clear.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `clear` script clears out your Flex keychain. 

Usage:
    `npm run clear`

This script clears out your credentials from the Flex keychain. This is useful if you want to remove the AccountSid/AuthToken that is saved in the keychain.

<!-- docs-generator:end - Do not remove or modify this section -->

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to set up the project.

```bash
# Install dependencies and link local packages with each other
cd packages/flex-plugin
npx lerna bootstrap

# Run tests
npm test

# To use your local package in a different project
npm link
# then in a different project
npm link flex-plugin
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

MIT
