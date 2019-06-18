![npm](https://img.shields.io/npm/v/craco-config-flex-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/craco-config-flex-plugin.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/craco-config-flex-plugin.svg?style=flat-square)](LICENSE.md)

# CRACO Config Flex Plugin

[CRACO](https://github.com/sharegate/craco) configuration override to build a Flex plugin.

## Installation

`craco-config-flex-plugin` dependency is added to your `package.json` when you create a new plugin with [create-flex-plugin](https://github.com/twilio/flex-plugin-builder/tree/master/packages/create-flex-plugin).

## Usage

You can edit the `craco.config.js` to provide your own configuration. Please visit [craco documentation](https://github.com/sharegate/craco/tree/master/packages/craco#configuration-overview) for more information.

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to set up the project.

```bash
# Install dependencies and link local packages with each other
cd packages/craco-config-flex-plugin
npx lerna bootstrap

# Run tests
npm test

# To use your local package in a different project
npm link
# then in a different project
npm link craco-config-flex-plugin
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

MIT
