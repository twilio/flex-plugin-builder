![npm](https://img.shields.io/npm/v/flex-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/flex-plugin.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin.svg?style=flat-square)](LICENSE.md)

# `flex-plugin`

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
    // setup your flex
    flex.TaskCanvas.Content.add(<p>Hello</p>);
  }
}

loadPlugin(MyPlugin);
```

Visit [Twilio Docs](https://www.twilio.com/docs/flex/tutorials/building-flex-plugins) for a tutorial on creating your first plugin.

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
