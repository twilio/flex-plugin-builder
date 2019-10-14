@twilio-labs/plugin-flex
========================

Twilio CLI plugin to interact with the Flex Plugin Builder (github.com/twilio/flex-plugin-builder)

This plugin adds functionality to the [Twilio CLI](https://github.com/twilio/twilio-cli) to locally develop,
build and deploy Twilio Flex plugins; it uses the [Flex Plugin Builder](https://github.com/twilio/flex-plugin-builder).

<!-- toc -->
* [Requirements](#requirements)
* [Usage](#usage)
* [Commands](#commands)
* [Contributing](#contributing)
* [License](#license)
<!-- tocstop -->

# Requirements

## Install the Twilio CLI

Via `npm` or `yarn`:

```sh-session
$ npm install -g twilio-cli
$ yarn global add twilio-cli
```

Via `homebrew`:

```sh-session
$ brew tap twilio/brew && brew install twilio
```

# Usage

```sh-session
$ twilio plugins:install @twilio-labs/plugin-flex
$ twilio --help flex
USAGE
  $ twilio flex
...
```

# Commands

<!-- commands -->
* [`twilio flex:plugins:create PluginName`](#twilio-flexpluginscreate)
* [`twilio flex:plugins:start`](#twilio-flex-start)
* [`twilio flex:plugins:build`](#twilio-flex-build)
* [`twilio flex:plugins:deploy`](#twilio-flex-deploy)
* [`twilio flex:plugins:remove`](#twilio-flex-remove)
