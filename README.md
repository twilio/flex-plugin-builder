<h1 align="center">Twilio Flex Plugin Builder</h1>
<p align="center">Monorepo for all the tooling needed to create a custom <a href="https://www.twilio.com/flex" target="_blank">Twilio Flex</a> plugins
</p>

<p align="center">
    <a href="https://travis-ci.com/twilio/flex-plugin-builder">
        <img src="https://travis-ci.com/twilio/flex-plugin-builder.svg?branch=master" title="Build Status" />
    </a>
    <a href="https://codecov.io/gh/twilio/flex-plugin-builder">
        <img src="https://codecov.io/gh/twilio/flex-plugin-builder/branch/master/graph/badge.svg" title="Code Coverage" />
    </a>
    <a href="#contributors">
        <img src="https://img.shields.io/badge/all_contributors-11-orange.svg?style=square" title="All Contributors" />
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

Flex Plugin Builder requires [Node.js](https://nodejs.org/). We support Node >= 10.12 (and recommend the _even_ versions of Node). This is a monorepo project managed by [lerna](https://github.com/lerna/lerna) for creating Twilio Flex plugins.

- [create-flex-plugin](packages/create-flex-plugin): The CLI tool to start a new Flex plugin project
- [flex-plugin](packages/flex-plugin): Runtime dependency for Flex plugins
- [flex-plugin-scripts](packages/flex-plugin-scripts): The scripts used for building, testing, and deploying your plugin

## User Guide

* [Creating a new plugin](packages/create-flex-plugin/README.md)
* [Available Scripts](packages/flex-plugin-scripts/README.md)
* [Troubleshooting and FAQ](faq.md)

## Changelog

Major changelogs can be found in the [changelog directory](/changelog).

## Contributing

Check out [CONTRIBUTING](CONTRIBUTING.md) for more information on how to contribute to this project.

## License

Flex Plugin Builder is licensed under [MIT](LICENSE).

## Contributors

Thanks goes to the wonderful people listed in [CONTRIBUTORS.md](CONTRIBUTORS.md).

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
