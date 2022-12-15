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
* [`twilio flex:plugins:archive:configuration`](#twilio-flexpluginsarchiveconfiguration)
* [`twilio flex:plugins:archive:plugin`](#twilio-flexpluginsarchiveplugin)
* [`twilio flex:plugins:archive:plugin-version`](#twilio-flexpluginsarchiveplugin-version)
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

## `twilio flex:plugins:archive:configuration`

Archives a Flex Plugin Configuration. Archived Plugin Configurations cannot be deployed to your Flex application and cannot be undone. Exercise extreme caution when using this command.

```
USAGE
  $ twilio flex:plugins:archive:configuration

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --sid=sid                        (required) The Flex Plugin Configuration SID to archive.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/archive/configuration.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/archive/configuration.js)_

## `twilio flex:plugins:archive:plugin`

Archives a Flex Plugin. Archived Plugins cannot be enabled on your Flex application and cannot be undone. Exercise extreme caution when using this command.

```
USAGE
  $ twilio flex:plugins:archive:plugin

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --name=name                      (required) The name of the Flex Plugin to archive.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/archive/plugin.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/archive/plugin.js)_

## `twilio flex:plugins:archive:plugin-version`

Archives a Flex Plugin Version. Archived Plugin Versions cannot be enabled on your Flex application and cannot be undone. Exercise extreme caution when using this command.

```
USAGE
  $ twilio flex:plugins:archive:plugin-version

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --name=name                      (required) The Flex Plugin name of the Plugin Version to archive.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
  --version=version                (required) The Flex Plugin Version to archive.
```

_See code: [dist/commands/flex/plugins/archive/plugin-version.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/archive/plugin-version.js)_

## `twilio flex:plugins:build`

Builds the Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/build.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/build.js)_

## `twilio flex:plugins:create NAME`

Creates a new Twilio Flex Plugin project

```
USAGE
  $ twilio flex:plugins:create NAME

ARGUMENTS
  NAME  Creates a new Twilio Flex Plugin project

        Arguments:
        name	Name of your plugin.

OPTIONS
  -a, --accountSid=accountSid  The Account SID for your Flex Project
  -h, --help=help
  -i, --install                Auto-install dependencies
  -r, --runtimeUrl             The URL to your Twilio Flex Runtime
  -s, --typescript             Create a TypeScript project
  -t, --template=template      A GitHub URL that contains your template
  -v, --version=version
  -y, --yarn                   Use yarn as your dependency manager

DESCRIPTION
  Arguments:
  name	Name of your plugin. This command needs to be invoked inside a plugin directory.
```

_See code: [dist/commands/flex/plugins/create.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/create.js)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.

  --description=description        (required) [default: The description of this Flex Plugin Configuration.] The
                                   description of this Flex Plugin Configuration.

  --disable-plugin=disable-plugin  The plugin to disable, formatted as pluginName. Use additional --disable-plugin to
                                   provide other plugins to disable.

  --enable-plugin=enable-plugin    The plugin to enable, formatted as pluginName@version. You may use pluginName@latest
                                   as a shortcut for enabling the latest version of the plugin. Use additional
                                   --enable-plugin to provide other plugins to enable.

  --name=name                      (required) [default: Autogenerated Release 1644895745030] The friendly name of the
                                   Flex Plugin Configuration.

  --new                            Creates a new Flex Plugin Configuration, otherwise will append to existing active
                                   Configuration.

  --plugin=plugin                  Alias for --enable-plugin.

  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/create-configuration.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/create-configuration.js)_

## `twilio flex:plugins:deploy`

Builds and deploys a new version of the Flex plugin to your Flex application. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --changelog=changelog            (required) The changes (added/removed) made in this plugin version.
  --clear-terminal                 Clears the terminal before running the command.
  --description=description        The description of this Flex plugin.
  --major                          Publishes the version as a major (SemVer).
  --minor                          Publishes the version as a minor (SemVer).
  --patch                          Publishes the version as a patch (SemVer); this is the default.
  --public                         Publishes the plugin as a public Twilio Asset; default is private.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
  --version=version                Publishes the version (SemVer).
```

_See code: [dist/commands/flex/plugins/deploy.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/deploy.js)_

## `twilio flex:plugins:describe:configuration`

Provides details of the Flex Plugin Configuration like status, description and its associated Plugins.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --sid=sid                        (required) The Flex Plugin Configuration SID.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/describe/configuration.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/describe/configuration.js)_

## `twilio flex:plugins:describe:plugin`

Provides details of the Flex Plugin like status, description and its Flex Plugin Versions.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --name=name                      (required) The name of the Flex Plugin to describe.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/describe/plugin.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/describe/plugin.js)_

## `twilio flex:plugins:describe:plugin-version`

Provides details of the Flex Plugin Version like changelog, status and the url of the plugin package.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --name=name                      (required) The Flex Plugin name of the Plugin Version to describe.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
  --version=version                (required) The Flex Plugin Version to describe.
```

_See code: [dist/commands/flex/plugins/describe/plugin-version.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/describe/plugin-version.js)_

## `twilio flex:plugins:describe:release`

Provides details of the Flex Plugin Release like the underlying Plugin Configuration and Plugins.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --active                         The most recent release to describe.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --sid=sid                        The Flex Plugin Release SID to describe.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/describe/release.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/describe/release.js)_

## `twilio flex:plugins:diff ID1 [ID2]`

Finds the diff between two Flex Plugin Configurations.

```
USAGE
  $ twilio flex:plugins:diff ID1 [ID2]

ARGUMENTS
  ID1  The first Flex Plugin Configuration SID.
  ID2  The second Flex Plugin Configuration SID.

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/diff.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/diff.js)_

## `twilio flex:plugins:list:configurations`

Lists the Flex Plugin Configuration on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/list/configurations.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/list/configurations.js)_

## `twilio flex:plugins:list:plugin-versions`

Lists the Flex Plugin Versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --name=name                      (required) The plugin name to list its versions.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/list/plugin-versions.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/list/plugin-versions.js)_

## `twilio flex:plugins:list:plugins`

Lists the Flex Plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/list/plugins.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/list/plugins.js)_

## `twilio flex:plugins:list:releases`

Lists the Flex Releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --json                           Outputs the result of the command as json string.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/list/releases.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/list/releases.js)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. Enables the plugins (passed as params or via the Flex Configuration) on your Flex application.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  -l=(debug|info|warn|error|none)        [default: info] Level of logging messages.
  -p, --profile=profile                  Shorthand identifier for your profile.
  --clear-terminal                       Clears the terminal before running the command.

  --configuration-sid=configuration-sid  The Flex Plugin Configuration SID to release; other options are not required
                                         when using this option.

  --description=description              [default: The description of this Flex Plugin Configuration.] The description
                                         of this Flex Plugin Configuration.

  --disable-plugin=disable-plugin        The plugin to disable, formatted as pluginName. Use additional --disable-plugin
                                         to provide other plugins to disable.

  --enable-plugin=enable-plugin          The plugin to enable, formatted as pluginName@version. You may use
                                         pluginName@latest as a shortcut for enabling the latest version of the plugin.
                                         Use additional --enable-plugin to provide other plugins to enable.

  --name=name                            [default: Autogenerated Release 1644895745030] The friendly name of the Flex
                                         Plugin Configuration.

  --new                                  Creates a new Flex Plugin Configuration, otherwise will append to existing
                                         active Configuration.

  --plugin=plugin                        Alias for --enable-plugin.

  --silent                               Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/release.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/release.js)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --include-remote                 Use this flag to include all remote plugins in your build.

  --name=name                      The name of the plugin you would like to run. You can provide multiple to run them
                                   all concurrently. You can include specific active remote plugins using "--name
                                   'plugin-name@remote'" or "--name 'plugin-name@0.0.0'" for a specific remote version.

  --port=port                      [default: 3000] The port to start your local development server on.

  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

> **_NOTE:_** You need to be logged in to [Flex](https://flex.twilio.com) in your browser before running the command with the options `--include-remote`, `--name=plugin-name@remote` or `--name=plugin-name@1.0.0`.

_See code: [dist/commands/flex/plugins/start.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/start.js)_

## `twilio flex:plugins:test`

Runs the test suite. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:test

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --clear-terminal                 Clears the terminal before running the command.
  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".
```

_See code: [dist/commands/flex/plugins/test.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/test.js)_

## `twilio flex:plugins:upgrade-plugin`

Upgrades your plugin to use the latest version of the Plugin CLI.

```
USAGE
  $ twilio flex:plugins:upgrade-plugin

OPTIONS
  -l=(debug|info|warn|error|none)  [default: info] Level of logging messages.
  -p, --profile=profile            Shorthand identifier for your profile.
  --beta                           If set, will upgrade to the latest beta version.
  --clear-terminal                 Clears the terminal before running the command.
  --dev                            If set, will upgrade to the latest dev version.
  --install                        If set, will install the dependencies.
  --nightly                        If set, will upgrade to the latest nightly version.

  --remove-legacy-plugin           Deletes legacy plugin bundle hosted on Twilio Assets (deployed via plugin builder
                                   v3).

  --silent                         Suppress output and logs. This is a shorthand for "-l none -o none".

  --yarn                           Use yarn for installation.

  --yes                            If set, will answer yes to all prompts.
```

_See code: [dist/commands/flex/plugins/upgrade-plugin.js](https://github.com/twilio/flex-plugin-builder/blob/v5.0.6-beta.0/dist/commands/flex/plugins/upgrade-plugin.js)_
<!-- commandsstop -->
