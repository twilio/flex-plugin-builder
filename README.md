<h1 align="center">Twilio Flex Plugin Builder</h1>
<p align="center">Monorepo for all the tooling needed to create a custom <a href="https://www.twilio.com/docs/flex/developer/plugins" target="_blank">Twilio Flex Plugins</a></p>

<p align="center">
    <a href="https://app.circleci.com/pipelines/github/twilio/flex-plugin-builder?branch=main" >
        <img src="https://circleci.com/gh/twilio/flex-plugin-builder/tree/main.svg?style=shield" />
    </a>
    <a href="https://codecov.io/gh/twilio/flex-plugin-builder">
        <img src="https://codecov.io/gh/twilio/flex-plugin-builder/branch/master/graph/badge.svg" title="Code Coverage" />
    </a>
    <a href="#contributors">
        <img src="https://img.shields.io/badge/all_contributors-14-orange.svg?style=square" title="All Contributors" />
    </a>
    <a href="./CODE_OF_CONDUCT.md">
        <img src="https://img.shields.io/badge/%F0%9F%92%96-code%20of%20conduct-ff69b4.svg?style=square" title="Code of Conducts" />
    </a>
    <a href="https://lernajs.io/">
        <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-squar" title="Lerna" />
    </a>
    <a href="./LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" title="License" />
    </a>
</p>

## Getting Started

Flex Plugin Builder requires [Node.js](https://nodejs.org/). We support and recommend the [LTS versions](https://nodejs.org/en/about/releases/) of Node. This is a monorepo project managed by [lerna](https://github.com/lerna/lerna) for creating Twilio Flex plugins.

- [@twilio-labs/plugin-flex](packages/plugin-flex): The CLI tool for creating, building, testing, deploying, and managing your plugins

## Local Development Setup

For local development of the Flex Plugin Builder itself, follow these steps:

### Initial Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Link all packages for local development:
   ```bash
   npm run link-packages
   ```
   
   This command will:
   - Create global npm links for all packages in the `/packages` folder
   - Link internal dependencies between packages
   - Run `npm run link` in the plugin-flex package to register the CLI tool

### Development Workflow

After making any changes to the source code, rebuild the packages:

```bash
npm run build
```

This ensures that all TypeScript files are compiled and changes are reflected across linked packages.

### Development Tips

- The `link-packages` script only needs to be run once during initial setup
- Run `npm run build` after every code change to see your changes take effect
- Use `npm run test` to run all tests across packages
- Individual packages can be built using `lerna run build --scope=@twilio/<package-name>`

## User Guide

Please visit [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins) for the latest docs on Plugins CLI and API.

* [Plugins CLI](https://www.twilio.com/docs/flex/developer/plugins/cli)
* [Plugins API](https://www.twilio.com/docs/flex/developer/plugins/api)
* [Troubleshooting and FAQ](faq.md)

## Changelog

Major changelogs can be found in the [changelog directory](/changelog).

## Contributing

Check out [CONTRIBUTING](CONTRIBUTING.md) for more information on how to contribute to this project.

## License

Flex Plugin Builder is licensed under [MIT](LICENSE).

## Contributors

Thanks to the wonderful people listed in [CONTRIBUTORS.md](CONTRIBUTORS.md).

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
