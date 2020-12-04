![npm](https://img.shields.io/npm/v/flex-plugin-scripts.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugin-scripts.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-scripts.svg?style=square)](../../LICENSE)

# Flex Plugin Scripts

Scripts to run, build, and deploy Flex plugin.

_Deprecation Notice_: These scripts are deprecated and no longer recommended to be used. Please head over to [Twilio CLI's Flex Plugins integration](https://github.com/twilio-labs/plugin-flex/tree/v1-beta) on how to use Plugin Builder.

## Installation

This repo will automatically be installed as part of creating a new plugin.

## Verbose/Debug Mode

All scripts can run with `DEBUG=1` for a more verbose mode. You may also use `TRACE=1` for an even more verbose mode.

## Customizing the Configuration

Plugin Builder is built using [Webpack.js](https://webpack.js.org/) and uses [Jest](https://jestjs.io) for testing. For users, they will not need to modify any of the Webpack/Jest configurations. For those who do, you can have full control over the Webpack/Jest! 

Create a `*.config.js` in the root directory of your application. For Jest, create a `jest.config.js`. For Webpack, create a `webpack.config.js`. For Webpack DevServer, create a `webpack.dev.js`. Each of these configurations file should be of the format below:

```js
module.exports = (config, { isProd, isDev, isTest }) => {
  /**
   * Modify the configuration and then return it
   */

  return config;
}
```

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

#### Multiple Accounts

Plugin Builder v3 stores your credentials locally in your keychain so you do not have to re-enter your credentials every time. If you like to provide a new set of AccountSid / AuthToken, you may set them as environmental variables before invoking the deploy command:

```bash
TWILIO_ACCOUNT_SID=ACxxx TWILIO_AUTH_TOKEN=abc123 npm run deploy
```

This will use the newly provided credentials and save them in the keychain as well. If you have multiple accounts saved in the keychain, you will be prompted to select on at runtime:

```text
? Select from one of the following Account Sids (Use arrow keys)
❯ AC0000000000000000000000000000000 
  AC0000000000000000000000000000001
  AC0000000000000000000000000000002
```

Invoking with the TWILIO_ACCOUNT_SID environmental variable, however, will remove this step and the script will use the provided account.

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
The `start` scripts sets up the server locally so you develop your Flex plugin in real-time.

Usage:
    `npm run start`

#### Changing server port

By the default, the script will try to start a server on port 3000, or the first available port larger than 3000. You can provide a custom port using the `PORT` environmental variable:

```bash
PORT=4000 npm run start
```

<!-- docs-generator:end - Do not remove or modify this section -->

### Remove
<!-- docs-generator:include('./docs/remove.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `remove` script removes/delete the the plugin permanently. 

Usage:
    `npm run remove`

<!-- docs-generator:end - Do not remove or modify this section -->

### Info
<!-- docs-generator:include('./docs/info.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `info` script provides information about your plugin, including the version of important packages that are currently installed. 

Use this script to provide information to the Twilio support team whenever you are having an issue with your plugin-builder.

Usage:
    `npm run info`

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

[MIT](../../LICENSE)
