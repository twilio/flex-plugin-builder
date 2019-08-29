[![Version](https://img.shields.io/npm/v/craco-config-flex-plugin.svg?style=square)](https://www.npmjs.com/package/craco-config-flex-plugin)
[![Download](https://img.shields.io/npm/dt/craco-config-flex-plugin.svg?style=square)](https://www.npmjs.com/package/craco-config-flex-plugin)
[![License](https://img.shields.io/npm/l/craco-config-flex-plugin.svg?style=square)](../../LICENSE)

# CRACO Config Flex Plugin

[CRACO](https://github.com/sharegate/craco) is an easy and comprehensible configuration layer for create-react-app. It allows you to configure things like eslint, babel, and webpack, without using eject.

## Installation

`craco-config-flex-plugin` dependency is added to your `package.json` when you create a new plugin with [create-flex-plugin](https://github.com/twilio/flex-plugin-builder/tree/master/packages/create-flex-plugin).

## Usage

To add custom `jest` or `webpack` configuration, you can provide `jest.config.js` and `webpack.config.js`. If these files exist in the root directory, then your configuration is merged into the default configuration; e.g. `merge(defaultConfig, yourConfig)`.

For more control over the configuration, you can edit the `craco.config.js`. You will need to use `craco.config.js` if you need to append changes to the configuration, as opposed to replacing a key completely. For example, to append a new webpack plugin, use config.plugins.push(newPlugin) within your craco.config.js file. Please visit [craco documentation](https://github.com/sharegate/craco/tree/master/packages/craco#configuration-overview) for more information.

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to set up the project.

```bash
# Install dependencies and link-local packages with each other
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

[MIT](../../LICENSE)
