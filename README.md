[![Build Status](https://travis-ci.org/twilio/flex-plugin-builder.svg?branch=master)](https://travis-ci.org/twilio/flex-plugin-builder)
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors)
[![Code of Conduct](https://img.shields.io/badge/%F0%9F%92%96-code%20of%20conduct-ff69b4.svg?style=flat-square)](CODE_OF_CONDUCT.md)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lernajs.io/)

# Twilio Flex Plugin Builder

Twilio Flex plugins allow you to augment/change the behavior and appearance of a [Twilio Flex](https://www.twilio.com/flex) Contact Center using React.

## User Guide

* [Creating a new plugin](packages/create-flex-plugin/README.md)
* [Overriding configuration](packages/craco-config-flex-plugin/README.md)

## Changelog

Major changelogs can be found in the [changelog directory](/tree/master/changelog).

## Project Structure

This is a monorepo project managed by [lerna](https://github.com/lerna/lerna) for creating Twilio Flex plugins.

- [create-flex-plugin](packages/create-flex-plugin): The CLI tool to start a new Flex plugin project
- [flex-plugin](packages/flex-plugin): Runtime dependency for Flex plugins
- [craco-config-flex-plugin](packages/craco-config-flex-plugin): Config override for [craco](https://github.com/sharegate/craco) used to develop and build Flex plugins


## Contributing

This project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### 1. For Project

Create a fork of this project for your GitHub user by clicking the `Fork` button at the top of this project

### 2. Setup

```bash
git clone git@github.com:<YOUR_USERNAME>/flex-plugin-builder.git
cd flex-plugin-builder
npm install
npx lerna bootstrap
```

### 3. Contributing to a package

Refer to the `README.md` of the respective packages in `packages/` for specific guidelines for those projects.

### 4. Submitting Changes

When you are happy with your changes, make sure to create a new branch with your changes and open a PR with your changes. For more info check out this [page describing the GitHub workflow](https://guides.github.com/introduction/flow/).


## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/1505101?v=4" width="100px;"/><br /><sub><b>Dominik Kundel</b></sub>](https://dkundel.com)<br />[💻](https://github.com/twilio/flex-plugin-builder/commits?author=dkundel "Code") [📖](https://github.com/twilio/flex-plugin-builder/commits?author=dkundel "Documentation") [🤔](#ideas-dkundel "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/3395618?v=4" width="100px;"/><br /><sub><b>Patrick Kolencherry</b></sub>](https://github.com/kolencherry)<br />[💻](https://github.com/twilio/flex-plugin-builder/commits?author=kolencherry "Code") [🐛](https://github.com/twilio/flex-plugin-builder/issues?q=author%3Akolencherry "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/1070220?v=4" width="100px;"/><br /><sub><b>Jen Aprahamian</b></sub>](http://twitter.com/jennifermarie)<br />[🐛](https://github.com/twilio/flex-plugin-builder/issues?q=author%3Ajennifermarie "Bug reports") [📖](https://github.com/twilio/flex-plugin-builder/commits?author=jennifermarie "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/218683?v=4" width="100px;"/><br /><sub><b>Ryan Kennedy</b></sub>](https://github.com/theryankennedy)<br />[💻](https://github.com/twilio/flex-plugin-builder/commits?author=theryankennedy "Code") [🤔](#ideas-theryankennedy "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/2159342?v=4" width="100px;"/><br /><sub><b>Martin Amps</b></sub>](https://ma.rtin.so)<br />[💻](https://github.com/twilio/flex-plugin-builder/commits?author=MartinAmps "Code") [🤔](#ideas-MartinAmps "Ideas, Planning, & Feedback") | [<img src="https://avatars0.githubusercontent.com/u/8806300?v=4" width="100px;"/><br /><sub><b>Andrea SonnY</b></sub>](https://andreasonny83.github.io)<br />[💻](https://github.com/twilio/flex-plugin-builder/commits?author=andreasonny83 "Code") [⚠️](https://github.com/twilio/flex-plugin-builder/commits?author=andreasonny83 "Tests") | [<img src="https://avatars0.githubusercontent.com/u/1033099?v=4" width="100px;"/><br /><sub><b>Shelby Hagman</b></sub>](https://shagman.codes)<br />[🐛](https://github.com/twilio/flex-plugin-builder/issues?q=author%3AShelbyZ "Bug reports") [💻](https://github.com/twilio/flex-plugin-builder/commits?author=ShelbyZ "Code") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars2.githubusercontent.com/u/25748497?v=4" width="100px;"/><br /><sub><b>Marc Andrew Landles</b></sub>](https://appwapp.com)<br />[🐛](https://github.com/twilio/flex-plugin-builder/issues?q=author%3Amalandles "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/372730?v=4" width="100px;"/><br /><sub><b>Ryan Pendergast</b></sub>](https://rynop.com)<br />[🐛](https://github.com/twilio/flex-plugin-builder/issues?q=author%3Arynop "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/1885320?v=4" width="100px;"/><br /><sub><b>Don Irwin</b></sub>](https://www.linkedin.com/in/viperguynaz/)<br />[🐛](https://github.com/twilio/flex-plugin-builder/issues?q=author%3Aviperguynaz "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/2308915?s=460&v=4" width="100px;"/><br /><sub><b>Kousha Talebian</b></sub>](https://www.linkedin.com/in/koushatalebian/)<br />[💻](https://github.com/twilio/flex-plugin-builder/commits?author=ktalebian "Code") 
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT
