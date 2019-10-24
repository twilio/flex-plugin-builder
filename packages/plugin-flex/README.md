@twilio-labs/plugin-flex
========================

Twilio CLI plugin to interact with the [Flex Plugin Builder](github.com/twilio/flex-plugin-builder)

This plugin adds functionality to the [Twilio CLI](https://github.com/twilio/twilio-cli) to locally develop,
build and deploy [Twilio Flex plugins](https://www.twilio.com/docs/flex/plugin-builder); it uses the [Flex Plugin Builder](https://github.com/twilio/flex-plugin-builder).

<!-- toc -->
* [Requirements](#requirements)
* [Usage](#usage)
* [Commands](#commands)
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
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)

## `twilio flex:plugins:build`

Builds your Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/build.js](https://github.com/twilio-labs/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/build.js)_

## `twilio flex:plugins:create NAME`

Creates a new Twilio Flex Plugin project

```
USAGE
  $ twilio flex:plugins:create NAME

ARGUMENTS
  NAME  Creates a new Twilio Flex Plugin project

        Arguments:
        name	Name of your plugin. Needs to start with plugin-

OPTIONS
  -a, --accountSid=accountSid      The Account SID for your Flex Project
  -h, --help=help
  -i, --install                    Auto-install dependencies
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
  -r, --runtimeUrl                 Auto-install dependencies
  -s, --typescript                 Create a TypeScript project
  -t, --template=template          A URL to a template directory
  -v, --version=version
  -y, --yarn                       Use yarn as your dependency manager

DESCRIPTION
  Arguments:
  name	Name of your plugin. Needs to start with plugin-.
```

_See code: [src/commands/flex/plugins/create.js](https://github.com/twilio-labs/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/create.js)_

## `twilio flex:plugins:deploy`

Builds and deploys your Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/deploy.js](https://github.com/twilio-labs/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/deploy.js)_

## `twilio flex:plugins:remove`

Removes your Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/remove.js](https://github.com/twilio-labs/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/remove.js)_

## `twilio flex:plugins:start`

Starts a dev-server to build your Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/start.js](https://github.com/twilio-labs/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/start.js)_
<!-- commandsstop -->
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)

## `twilio flex:plugins:build`

Builds your Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/build.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/build.js)_

## `twilio flex:plugins:create NAME`

Creates a new Twilio Flex Plugin project

```
USAGE
  $ twilio flex:plugins:create NAME

ARGUMENTS
  NAME  Creates a new Twilio Flex Plugin project

        Arguments:
        name	Name of your plugin. Needs to start with plugin-

OPTIONS
  -a, --accountSid=accountSid      The Account SID for your Flex Project
  -h, --help=help
  -i, --install                    Auto-install dependencies
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
  -r, --runtimeUrl                 Auto-install dependencies
  -s, --typescript                 Create a TypeScript project
  -t, --template=template          A URL to a template directory
  -v, --version=version
  -y, --yarn                       Use yarn as your dependency manager

DESCRIPTION
  Arguments:
  name	Name of your plugin. Needs to start with plugin-.
```

_See code: [src/commands/flex/plugins/create.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/create.js)_

## `twilio flex:plugins:deploy`

Builds and deploys your Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/deploy.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/deploy.js)_

## `twilio flex:plugins:remove`

Removes your Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/remove.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/remove.js)_

## `twilio flex:plugins:start`

Starts a dev-server to build your Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/start.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/start.js)_
<!-- commandsstop -->
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)

## `twilio flex:plugins:build`

Builds your Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/build.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/build.js)_

## `twilio flex:plugins:create NAME`

Creates a new Twilio Flex Plugin project

```
USAGE
  $ twilio flex:plugins:create NAME

ARGUMENTS
  NAME  Creates a new Twilio Flex Plugin project

        Arguments:
        name	Name of your plugin. Needs to start with plugin-

OPTIONS
  -a, --accountSid=accountSid      The Account SID for your Flex Project
  -h, --help=help
  -i, --install                    Auto-install dependencies
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
  -r, --runtimeUrl                 Auto-install dependencies
  -s, --typescript                 Create a TypeScript project
  -t, --template=template          A URL to a template directory
  -v, --version=version
  -y, --yarn                       Use yarn as your dependency manager

DESCRIPTION
  Arguments:
  name	Name of your plugin. Needs to start with plugin-.
```

_See code: [src/commands/flex/plugins/create.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/create.js)_

## `twilio flex:plugins:deploy`

Builds and deploys your Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/deploy.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/deploy.js)_

## `twilio flex:plugins:remove`

Removes your Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/remove.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/remove.js)_

## `twilio flex:plugins:start`

Starts a dev-server to build your Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -o=(columns|json|tsv)            [default: columns] Format of command output.
  -p, --profile=profile            Shorthand identifier for your profile.
```

_See code: [src/commands/flex/plugins/start.js](https://github.com/twilio/plugin-flex/blob/v0.1.3/src/commands/flex/plugins/start.js)_
<!-- commandsstop -->
