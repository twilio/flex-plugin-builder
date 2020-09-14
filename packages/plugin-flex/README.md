@twilio-labs/plugin-flex
========================

Twilio CLI plugin to interact with the [Flex Plugin Builder](https://github.com/twilio/flex-plugin-builder)

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
* [`twilio flex:plugins:create-configuration`](#twilio-flexpluginscreate-configuration)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:describe:configuration`](#twilio-flexpluginsdescribeconfiguration)
* [`twilio flex:plugins:describe:plugin`](#twilio-flexpluginsdescribeplugin)
* [`twilio flex:plugins:describe:plugin-version`](#twilio-flexpluginsdescribeplugin-version)
* [`twilio flex:plugins:describe:release`](#twilio-flexpluginsdescriberelease)
* [`twilio flex:plugins:diff ID1 [ID2]`](#twilio-flexpluginsdiff-id1-id2)
* [`twilio flex:plugins:list:configurations`](#twilio-flexpluginslistconfigurations)
* [`twilio flex:plugins:list:plugin-versions`](#twilio-flexpluginslistplugin-versions)
* [`twilio flex:plugins:list:plugins`](#twilio-flexpluginslistplugins)
* [`twilio flex:plugins:list:releases`](#twilio-flexpluginslistreleases)
* [`twilio flex:plugins:release`](#twilio-flexpluginsrelease)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)
* [`twilio flex:plugins:test`](#twilio-flexpluginstest)
* [`twilio flex:plugins:upgrade-plugin`](#twilio-flexpluginsupgrade-plugin)

## `twilio flex:plugins:build`

Builds Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
```

_See code: [src/commands/flex/plugins/build.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/build.ts)_

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
  -a, --accountSid=accountSid  The Account SID for your Flex Project
  -h, --help=help
  -i, --install                Auto-install dependencies
  -r, --runtimeUrl             Auto-install dependencies
  -s, --typescript             Create a TypeScript project
  -t, --template=template      A URL to a template directory
  -v, --version=version
  -y, --yarn                   Use yarn as your dependency manager

DESCRIPTION
  Arguments:
  name	Name of your plugin. Needs to start with plugin-. This command needs to be invoked inside a plugin directory.
```

_See code: [src/commands/flex/plugins/create.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/create.ts)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  --clear-terminal           Outputs the result of the command as json string
  --description=description  The description of this Flex Plugin Configuration
  --json                     Outputs the result of the command as json string
  --name=name                [default: Sep 14, 2020] The friendly name of the Flex Plugin Configuration
  --new                      The friendly name of the Flex Plugin Configuration

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install
```

_See code: [src/commands/flex/plugins/create-configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/create-configuration.ts)_

## `twilio flex:plugins:deploy`

Builds and deploys a new version of Flex plugin to your Flex application. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  --changelog=changelog      The changes (added/removed) made in this plugin version
  --clear-terminal           Outputs the result of the command as json string
  --description=description  The description of this Flex plugin
  --json                     Outputs the result of the command as json string
  --major                    Publishes the version as a major (semver)
  --minor                    Publishes the version as a minor (semver)
  --patch                    Publishes the version as a patch (semver); this is the default
  --public                   Publishes the plugin as a public Twilio Asset; default is private
  --version=version          The custom version to publish
```

_See code: [src/commands/flex/plugins/deploy.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/deploy.ts)_

## `twilio flex:plugins:describe:configuration`

Describes a Flex Plugin Configuration and its associated Plugins.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
  --sid=sid         (required) The Flex Plugin Configuration SID
```

_See code: [src/commands/flex/plugins/describe/configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/describe/configuration.ts)_

## `twilio flex:plugins:describe:plugin`

Describes a Flex Plugin and its Flex Plugin Versions.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
  --name=name       (required) The Flex Plugin name to describe
```

_See code: [src/commands/flex/plugins/describe/plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/describe/plugin.ts)_

## `twilio flex:plugins:describe:plugin-version`

Describes a Flex Plugin Version.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  --clear-terminal   Outputs the result of the command as json string
  --json             Outputs the result of the command as json string
  --name=name        (required) The Flex Plugin name of the Plugin Version to describe
  --version=version  (required) The Flex Plugin Version to describe
```

_See code: [src/commands/flex/plugins/describe/plugin-version.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/describe/plugin-version.ts)_

## `twilio flex:plugins:describe:release`

Describes a Flex Plugin Release and its Plugin Configuration.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  --active
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
  --sid=sid         The Flex Plugin Release SID to describe
```

_See code: [src/commands/flex/plugins/describe/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/describe/release.ts)_

## `twilio flex:plugins:diff ID1 [ID2]`

Finds the diff between two configurations.

```
USAGE
  $ twilio flex:plugins:diff ID1 [ID2]

ARGUMENTS
  ID1  The first Flex Plugin Configuration SID
  ID2  The second Flex Plugin Configuration SID

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
```

_See code: [src/commands/flex/plugins/diff.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/diff.ts)_

## `twilio flex:plugins:list:configurations`

Lists the Flex Plugin Configuration on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
```

_See code: [src/commands/flex/plugins/list/configurations.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/list/configurations.ts)_

## `twilio flex:plugins:list:plugin-versions`

Lists the Flex Plugin Versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
  --name=name       (required) The plugin name to list its versions
```

_See code: [src/commands/flex/plugins/list/plugin-versions.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/list/plugin-versions.ts)_

## `twilio flex:plugins:list:plugins`

Lists the Flex Plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
```

_See code: [src/commands/flex/plugins/list/plugins.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/list/plugins.ts)_

## `twilio flex:plugins:list:releases`

Lists the Flex Releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
```

_See code: [src/commands/flex/plugins/list/releases.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/list/releases.ts)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  --clear-terminal                       Outputs the result of the command as json string

  --configuration-sid=configuration-sid  The Flex Plugin Configuration SID to release; other options are not required
                                         when using this option

  --description=description              The description of this Flex Plugin Configuration

  --json                                 Outputs the result of the command as json string

  --name=name                            [default: Sep 14, 2020] The friendly name of the Flex Plugin Configuration

  --new                                  The friendly name of the Flex Plugin Configuration

  --plugin=plugin                        The plugin to install, formatted as pluginName@version. Use additional --plugin
                                         to provide other plugins to install
```

_See code: [src/commands/flex/plugins/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/release.ts)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --include-remote  Use this flag to include all remote plugins in your build
  --json            Outputs the result of the command as json string
  --name=name       The name of the plugin(s) you would like to run
```

_See code: [src/commands/flex/plugins/start.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/start.ts)_

## `twilio flex:plugins:test`

Runs the test suite. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:test

OPTIONS
  --clear-terminal  Outputs the result of the command as json string
  --json            Outputs the result of the command as json string
```

_See code: [src/commands/flex/plugins/test.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/test.ts)_

## `twilio flex:plugins:upgrade-plugin`

Upgrades the scaffolding of the plugin to the latest version.

```
USAGE
  $ twilio flex:plugins:upgrade-plugin

OPTIONS
  --beta            If set, will upgrade to the latest beta version
  --clear-terminal  Outputs the result of the command as json string
  --install         If set, will run `npm install`
  --json            Outputs the result of the command as json string
  --yes             If set, will answer yes to all prompts
```

_See code: [src/commands/flex/plugins/upgrade-plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.12.1-next.0/src/commands/flex/plugins/upgrade-plugin.ts)_
<!-- commandsstop -->
