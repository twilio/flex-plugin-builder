![npm](https://img.shields.io/npm/v/react-app-rewire-flex-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/react-app-rewire-flex-plugin.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/react-app-rewire-flex-plugin.svg?style=flat-square)](LICENSE.md)

# `react-app-rewire-flex-plugin`

Config overrides for [`react-app-rewired`](https://npm.im/react-app-rewired) to build a [Twilio Flex](https://www.twilio.com/flex).

## Installation

Make sure you have an existing project that was started with [`create-react-app`](https://npm.im/create-react-app).

Alternatively, if you are starting new check out [`create-flex-plugin`](https://npm.im/create-flex-plugin).

```bash
npm install flex-plugin
npm install -D react-app-rewired react-app-rewire-flex-plugin
```

## Usage

Update your `package.json` to contain

```js
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test --env=jsdom",
  "eject": "react-app-rewired eject"
},
"config-overrides-path": "node_modules/react-app-rewire-flex-plugin"
```

Run `npm start` or `npm run build`.

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to setup the project

```bash
# Install dependencies and link local packages with each other
cd packages/react-app-rewire-flex-plugin
npx lerna bootstrap

# Run tests
npm test

# To use your local package in a different project
npm link
# then in a different project
npm link react-app-rewire-flex-plugin
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

MIT
