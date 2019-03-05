![npm](https://img.shields.io/npm/v/create-flex-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/create-flex-plugin.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/create-flex-plugin.svg?style=flat-square)](LICENSE.md)

# `create-flex-plugin`

Command-line tool to create, develop and build a new Twilio Flex Plugin.

## Usage

There is a variety of ways to use/install. The quickest way is:

```bash
npm init flex-plugin plugin-demo
cd plugin-demo
npm start
```

### How to install/run using `npm`

#### Using `npm`:

```bash
# Via npm init
npm init flex-plugin plugin-demo

# Via npx
npx create-flex-plugin plugin-demo

# Install globally
npm install -g create-flex-plugin
create-flex-plugin plugin-demo
```

We do not support `yarn` at the moment.

### Command line arguments:

```
create-flex-plugin <name>

Creates a new Twilio Flex Plugin project

Arguments:
name    Name of your plugin. Needs to start with plugin-

Options:
  --accountSid, -a  The Account SID for your Flex Project
  --runtimeUrl, -r  The URL to your Twilio Flex Runtime
  --install         Auto-install dependencies         [boolean] [default: false]
  -h, --help        Show help                                          [boolean]
  -v, --version     Show version number                                [boolean]
```

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to setup the project

```bash
# Install dependencies and link local packages with each other
cd packages/create-flex-plugin
npx lerna bootstrap

# Run tests
npm test

# To execute your local version the CLI
npm link
create-flex-plugin --help
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

MIT
