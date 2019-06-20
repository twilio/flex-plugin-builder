![npm](https://img.shields.io/npm/v/flex-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/flex-plugin.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin.svg?style=flat-square)](LICENSE.md)

# Flex Plugin

Library to help building [Twilio Flex](https://www.twilio.com/flex) Plugins.

## Installation

```bash
npm install flex-plugin
```

## Usage

```js
import { loadPlugin, FlexPlugin } from 'flex-plugin';

class MyPlugin extends FlexPlugin {
  pluginName = 'MyPlugin';

  init(flex, manager) {
    // set up your flex
    flex.TaskCanvas.Content.add(<p>Hello</p>);
  }
}

loadPlugin(MyPlugin);
```

Visit [Twilio Docs](https://www.twilio.com/docs/flex/tutorials/building-flex-plugins) for a tutorial on creating your first plugin.

## Libraries

### Loading External JS/CSS Files

To load external JS/CSS files into your plugin, we provide two helper methods: `loadJS` and `loadCSS`. Use them by calling these methods at the start of plugin initialization.

```js
import { FlexPlugin, loadJS, loadCSS } from 'flex-plugin';

class MyPlugin extends FlexPlugin {
  pluginName = 'MyPlugin';

  init(flex, manager) {
    loadJS('https//my-publicly-accessible-domain.com/test.js');
    loadCSS(
      'https//my-publicly-accessible-domain.com/test.css',
      'https//my-publicly-accessible-domain.com/test-2.css',
    );

    // set up everything else
  }
}
```

## External Dependencies

The following NPM packages are defined as external dependencies:

```
react
react-dom
redux
react-redux
```

When you `build` your plugin, these dependencies will not be included in your bundle. Instead, Flex UI will provide them as global for your plugin to use.

To ensure you are using the same version that Flex UI is exposing, leave the version of the React that is specified in your `package.json`. See [React Version](#react-version) to see the currently supported version.

## React Versions

We currently support the following versions:

```
react          16.5.2
react-dom      16.5.2
redux          3.7.2
react-redux    5.1.0
```

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to setup the project

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
