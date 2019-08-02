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
<!-- docs-generator:start - Do not remove or modify this section -->
The `test` scripts run your unit tests using `jest`.

Usage:
    `npm run test`

<!-- docs-generator:end - Do not remove or modify this section -->

### Start
#### Changing server port

By the default, the script will try to start a server on port 3000, or the first available port larger than 3000. You can provide a custom port using the `PORT` environmental variable:

```bash
PORT=4000 npm run start
```

<!-- docs-generator:end - Do not remove or modify this section -->


This script clears out your credentials from the Flex keychain. This is useful if you want to remove the AccountSid/AuthToken that is saved in the keychain.

<!-- docs-generator:end - Do not remove or modify this section -->

### Remove
<!-- docs-generator:include('./docs/remove.md') -->
<!-- docs-generator:start - Do not remove or modify this section -->
The `remove` script removes/delete the the plugin permanently. 

Usage:
    `npm run remove`

<!-- docs-generator:end - Do not remove or modify this section -->

## Contributing


## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

MIT
