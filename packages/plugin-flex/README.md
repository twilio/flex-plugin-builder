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
* [`twilio flex:plugins:list:configurations`](#twilio-flexpluginslistconfigurations)
* [`twilio flex:plugins:list:plugin-versions`](#twilio-flexpluginslistplugin-versions)
* [`twilio flex:plugins:list:plugins`](#twilio-flexpluginslistplugins)
* [`twilio flex:plugins:list:releases`](#twilio-flexpluginslistreleases)
* [`twilio flex:plugins:release`](#twilio-flexpluginsrelease)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)
* [`twilio flex:tmp`](#twilio-flextmp)

## `twilio flex:plugins:build`

Builds Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/build.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/build.ts)_

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

_See code: [src/commands/flex/plugins/create.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/create.ts)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  --description=description  The configuration description
  --json
  --name=name                [default: Jul 29, 2020]
  --new

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install
```

_See code: [src/commands/flex/plugins/create-configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/create-configuration.ts)_

## `twilio flex:plugins:deploy`

Builds and deploys Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  --changelog=changelog
  --description=description
  --json
  --major
  --minor
  --patch
  --public
  --version=version
```

_See code: [src/commands/flex/plugins/deploy.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/deploy.ts)_

## `twilio flex:plugins:describe:configuration`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  --json
  --sid=sid  (required)
```

_See code: [src/commands/flex/plugins/describe/configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/describe/configuration.ts)_

## `twilio flex:plugins:describe:plugin`

Describes a plugin.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  --json
  --name=name  (required) The plugin name to describe
```

_See code: [src/commands/flex/plugins/describe/plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/describe/plugin.ts)_

## `twilio flex:plugins:describe:plugin-version`

Describes a plugin version.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  --json
  --name=name        (required) The plugin name to describe
  --version=version  (required) The plugin version to describe
```

_See code: [src/commands/flex/plugins/describe/plugin-version.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/describe/plugin-version.ts)_

## `twilio flex:plugins:describe:release`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  --active
  --json
  --sid=sid  The release sid to describe
```

_See code: [src/commands/flex/plugins/describe/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/describe/release.ts)_

## `twilio flex:plugins:list:configurations`

Lists the configurations on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/configurations.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/list/configurations.ts)_

## `twilio flex:plugins:list:plugin-versions`

Lists the plugin versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  --json
  --name=name  (required) The plugin name to list its versions
```

_See code: [src/commands/flex/plugins/list/plugin-versions.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/list/plugin-versions.ts)_

## `twilio flex:plugins:list:plugins`

Lists the plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/plugins.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/list/plugins.ts)_

## `twilio flex:plugins:list:releases`

Lists the releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/releases.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/list/releases.ts)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  --configuration-sid=configuration-sid
  --description=description              The configuration description
  --json
  --name=name                            [default: Jul 29, 2020]
  --new

  --plugin=plugin                        The plugin to install, formatted as pluginName@version. Use additional --plugin
                                         to provide other plugins to install
```

_See code: [src/commands/flex/plugins/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/release.ts)_

## `twilio flex:plugins:remove`

Removes the Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/remove.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/remove.ts)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  --include-remote
  --json
  --name=name
```

_See code: [src/commands/flex/plugins/start.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/plugins/start.ts)_

## `twilio flex:tmp`

```
USAGE
  $ twilio flex:tmp

OPTIONS
  --json
```

_See code: [src/commands/flex/tmp.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.6.0-next.0/src/commands/flex/tmp.ts)_
<!-- commandsstop -->
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:create-configuration`](#twilio-flexpluginscreate-configuration)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:describe:configuration`](#twilio-flexpluginsdescribeconfiguration)
* [`twilio flex:plugins:describe:plugin`](#twilio-flexpluginsdescribeplugin)
* [`twilio flex:plugins:describe:plugin-version`](#twilio-flexpluginsdescribeplugin-version)
* [`twilio flex:plugins:describe:release`](#twilio-flexpluginsdescriberelease)
* [`twilio flex:plugins:list:configurations`](#twilio-flexpluginslistconfigurations)
* [`twilio flex:plugins:list:plugin-versions`](#twilio-flexpluginslistplugin-versions)
* [`twilio flex:plugins:list:plugins`](#twilio-flexpluginslistplugins)
* [`twilio flex:plugins:list:releases`](#twilio-flexpluginslistreleases)
* [`twilio flex:plugins:release`](#twilio-flexpluginsrelease)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)
* [`twilio flex:tmp`](#twilio-flextmp)

## `twilio flex:plugins:build`

Builds Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/build.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/build.ts)_

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

_See code: [src/commands/flex/plugins/create.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/create.ts)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/create-configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/create-configuration.ts)_

## `twilio flex:plugins:deploy`

Builds and deploys Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  --changelog=changelog
  --description=description
  --json
  --major
  --minor
  --patch
  --public
  --version=version
```

_See code: [src/commands/flex/plugins/deploy.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/deploy.ts)_

## `twilio flex:plugins:describe:configuration`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  --json
  --version=version  (required) The configuration version to describe
```

_See code: [src/commands/flex/plugins/describe/configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/configuration.ts)_

## `twilio flex:plugins:describe:plugin`

Describes a plugin.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  --json
  --name=name  (required) The plugin name to describe
```

_See code: [src/commands/flex/plugins/describe/plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/plugin.ts)_

## `twilio flex:plugins:describe:plugin-version`

Describes a plugin version.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  --json
  --name=name        (required) The plugin name to describe
  --version=version  (required) The plugin version to describe
```

_See code: [src/commands/flex/plugins/describe/plugin-version.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/plugin-version.ts)_

## `twilio flex:plugins:describe:release`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  --active
  --json
  --sid=sid  The release sid to describe
```

_See code: [src/commands/flex/plugins/describe/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/release.ts)_

## `twilio flex:plugins:list:configurations`

Lists the configurations on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/configurations.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/configurations.ts)_

## `twilio flex:plugins:list:plugin-versions`

Lists the plugin versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  --json
  --name=name  (required) The plugin name to list its versions
```

_See code: [src/commands/flex/plugins/list/plugin-versions.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/plugin-versions.ts)_

## `twilio flex:plugins:list:plugins`

Lists the plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/plugins.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/plugins.ts)_

## `twilio flex:plugins:list:releases`

Lists the releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/releases.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/releases.ts)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/release.ts)_

## `twilio flex:plugins:remove`

Removes the Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/remove.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/remove.ts)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/start.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/start.ts)_

## `twilio flex:tmp`

```
USAGE
  $ twilio flex:tmp

OPTIONS
  --json
```

_See code: [src/commands/flex/tmp.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/tmp.ts)_
<!-- commandsstop -->
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:create-configuration`](#twilio-flexpluginscreate-configuration)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:describe:configuration`](#twilio-flexpluginsdescribeconfiguration)
* [`twilio flex:plugins:describe:plugin`](#twilio-flexpluginsdescribeplugin)
* [`twilio flex:plugins:describe:plugin-version`](#twilio-flexpluginsdescribeplugin-version)
* [`twilio flex:plugins:describe:release`](#twilio-flexpluginsdescriberelease)
* [`twilio flex:plugins:list:configurations`](#twilio-flexpluginslistconfigurations)
* [`twilio flex:plugins:list:plugin-versions`](#twilio-flexpluginslistplugin-versions)
* [`twilio flex:plugins:list:plugins`](#twilio-flexpluginslistplugins)
* [`twilio flex:plugins:list:releases`](#twilio-flexpluginslistreleases)
* [`twilio flex:plugins:release`](#twilio-flexpluginsrelease)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)
* [`twilio flex:tmp`](#twilio-flextmp)

## `twilio flex:plugins:build`

Builds Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/build.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/build.ts)_

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

_See code: [src/commands/flex/plugins/create.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/create.ts)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/create-configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/create-configuration.ts)_

## `twilio flex:plugins:deploy`

Builds and deploys Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  --changelog=changelog
  --description=description
  --json
  --major
  --minor
  --patch
  --public
  --version=version
```

_See code: [src/commands/flex/plugins/deploy.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/deploy.ts)_

## `twilio flex:plugins:describe:configuration`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  --json
  --version=version  (required) The configuration version to describe
```

_See code: [src/commands/flex/plugins/describe/configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/configuration.ts)_

## `twilio flex:plugins:describe:plugin`

Describes a plugin.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  --json
  --name=name  (required) The plugin name to describe
```

_See code: [src/commands/flex/plugins/describe/plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/plugin.ts)_

## `twilio flex:plugins:describe:plugin-version`

Describes a plugin version.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  --json
  --name=name        (required) The plugin name to describe
  --version=version  (required) The plugin version to describe
```

_See code: [src/commands/flex/plugins/describe/plugin-version.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/plugin-version.ts)_

## `twilio flex:plugins:describe:release`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  --active
  --json
  --sid=sid  The release sid to describe
```

_See code: [src/commands/flex/plugins/describe/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/describe/release.ts)_

## `twilio flex:plugins:list:configurations`

Lists the configurations on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/configurations.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/configurations.ts)_

## `twilio flex:plugins:list:plugin-versions`

Lists the plugin versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  --json
  --name=name  (required) The plugin name to list its versions
```

_See code: [src/commands/flex/plugins/list/plugin-versions.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/plugin-versions.ts)_

## `twilio flex:plugins:list:plugins`

Lists the plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/plugins.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/plugins.ts)_

## `twilio flex:plugins:list:releases`

Lists the releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/releases.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/list/releases.ts)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/release.ts)_

## `twilio flex:plugins:remove`

Removes the Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/remove.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/remove.ts)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/start.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/plugins/start.ts)_

## `twilio flex:tmp`

```
USAGE
  $ twilio flex:tmp

OPTIONS
  --json
```

_See code: [src/commands/flex/tmp.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.5.0-next.0/src/commands/flex/tmp.ts)_
<!-- commandsstop -->
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:create-configuration`](#twilio-flexpluginscreate-configuration)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:describe:configuration`](#twilio-flexpluginsdescribeconfiguration)
* [`twilio flex:plugins:describe:plugin`](#twilio-flexpluginsdescribeplugin)
* [`twilio flex:plugins:describe:plugin-version`](#twilio-flexpluginsdescribeplugin-version)
* [`twilio flex:plugins:describe:release`](#twilio-flexpluginsdescriberelease)
* [`twilio flex:plugins:list:configurations`](#twilio-flexpluginslistconfigurations)
* [`twilio flex:plugins:list:plugin-versions`](#twilio-flexpluginslistplugin-versions)
* [`twilio flex:plugins:list:plugins`](#twilio-flexpluginslistplugins)
* [`twilio flex:plugins:list:releases`](#twilio-flexpluginslistreleases)
* [`twilio flex:plugins:release`](#twilio-flexpluginsrelease)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)
* [`twilio flex:tmp`](#twilio-flextmp)

## `twilio flex:plugins:build`

Builds Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/build.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/build.ts)_

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

_See code: [src/commands/flex/plugins/create.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/create.ts)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/create-configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/create-configuration.ts)_

## `twilio flex:plugins:deploy`

Builds and deploys Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  --changelog=changelog
  --json
  --major
  --minor
  --patch
  --public
  --version=version
```

_See code: [src/commands/flex/plugins/deploy.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/deploy.ts)_

## `twilio flex:plugins:describe:configuration`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  --json
  --version=version  (required) The configuration version to describe
```

_See code: [src/commands/flex/plugins/describe/configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/configuration.ts)_

## `twilio flex:plugins:describe:plugin`

Describes a plugin.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  --json
  --name=name  (required) The plugin name to describe
```

_See code: [src/commands/flex/plugins/describe/plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/plugin.ts)_

## `twilio flex:plugins:describe:plugin-version`

Describes a plugin version.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  --json
  --name=name        (required) The plugin name to describe
  --version=version  (required) The plugin version to describe
```

_See code: [src/commands/flex/plugins/describe/plugin-version.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/plugin-version.ts)_

## `twilio flex:plugins:describe:release`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  --active
  --json
  --sid=sid  The release sid to describe
```

_See code: [src/commands/flex/plugins/describe/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/release.ts)_

## `twilio flex:plugins:list:configurations`

Lists the configurations on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/configurations.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/configurations.ts)_

## `twilio flex:plugins:list:plugin-versions`

Lists the plugin versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  --json
  --name=name  (required) The plugin name to list its versions
```

_See code: [src/commands/flex/plugins/list/plugin-versions.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/plugin-versions.ts)_

## `twilio flex:plugins:list:plugins`

Lists the plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/plugins.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/plugins.ts)_

## `twilio flex:plugins:list:releases`

Lists the releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/releases.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/releases.ts)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/release.ts)_

## `twilio flex:plugins:remove`

Removes the Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/remove.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/remove.ts)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/start.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/start.ts)_

## `twilio flex:tmp`

```
USAGE
  $ twilio flex:tmp

OPTIONS
  --json
```

_See code: [src/commands/flex/tmp.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/tmp.ts)_
<!-- commandsstop -->
* [`twilio flex:plugins:build`](#twilio-flexpluginsbuild)
* [`twilio flex:plugins:create NAME`](#twilio-flexpluginscreate-name)
* [`twilio flex:plugins:create-configuration`](#twilio-flexpluginscreate-configuration)
* [`twilio flex:plugins:deploy`](#twilio-flexpluginsdeploy)
* [`twilio flex:plugins:describe:configuration`](#twilio-flexpluginsdescribeconfiguration)
* [`twilio flex:plugins:describe:plugin`](#twilio-flexpluginsdescribeplugin)
* [`twilio flex:plugins:describe:plugin-version`](#twilio-flexpluginsdescribeplugin-version)
* [`twilio flex:plugins:describe:release`](#twilio-flexpluginsdescriberelease)
* [`twilio flex:plugins:list:configurations`](#twilio-flexpluginslistconfigurations)
* [`twilio flex:plugins:list:plugin-versions`](#twilio-flexpluginslistplugin-versions)
* [`twilio flex:plugins:list:plugins`](#twilio-flexpluginslistplugins)
* [`twilio flex:plugins:list:releases`](#twilio-flexpluginslistreleases)
* [`twilio flex:plugins:release`](#twilio-flexpluginsrelease)
* [`twilio flex:plugins:remove`](#twilio-flexpluginsremove)
* [`twilio flex:plugins:start`](#twilio-flexpluginsstart)
* [`twilio flex:tmp`](#twilio-flextmp)

## `twilio flex:plugins:build`

Builds Flex plugin and creates a JavaScript and sourcemap bundle. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:build

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/build.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/build.ts)_

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

_See code: [src/commands/flex/plugins/create.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/create.ts)_

## `twilio flex:plugins:create-configuration`

Creates a Flex Plugin Configuration. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:create-configuration

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/create-configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/create-configuration.ts)_

## `twilio flex:plugins:deploy`

Builds and deploys Flex plugin to Twilio Assets. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:deploy

OPTIONS
  --changelog=changelog
  --json
  --major
  --minor
  --patch
  --public
  --version=version
```

_See code: [src/commands/flex/plugins/deploy.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/deploy.ts)_

## `twilio flex:plugins:describe:configuration`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:configuration

OPTIONS
  --json
  --version=version  (required) The configuration version to describe
```

_See code: [src/commands/flex/plugins/describe/configuration.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/configuration.ts)_

## `twilio flex:plugins:describe:plugin`

Describes a plugin.

```
USAGE
  $ twilio flex:plugins:describe:plugin

OPTIONS
  --json
  --name=name  (required) The plugin name to describe
```

_See code: [src/commands/flex/plugins/describe/plugin.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/plugin.ts)_

## `twilio flex:plugins:describe:plugin-version`

Describes a plugin version.

```
USAGE
  $ twilio flex:plugins:describe:plugin-version

OPTIONS
  --json
  --name=name        (required) The plugin name to describe
  --version=version  (required) The plugin version to describe
```

_See code: [src/commands/flex/plugins/describe/plugin-version.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/plugin-version.ts)_

## `twilio flex:plugins:describe:release`

Describes a release.

```
USAGE
  $ twilio flex:plugins:describe:release

OPTIONS
  --active
  --json
  --sid=sid  The release sid to describe
```

_See code: [src/commands/flex/plugins/describe/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/describe/release.ts)_

## `twilio flex:plugins:list:configurations`

Lists the configurations on the account.

```
USAGE
  $ twilio flex:plugins:list:configurations

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/configurations.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/configurations.ts)_

## `twilio flex:plugins:list:plugin-versions`

Lists the plugin versions on the account.

```
USAGE
  $ twilio flex:plugins:list:plugin-versions

OPTIONS
  --json
  --name=name  (required) The plugin name to list its versions
```

_See code: [src/commands/flex/plugins/list/plugin-versions.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/plugin-versions.ts)_

## `twilio flex:plugins:list:plugins`

Lists the plugins on the account.

```
USAGE
  $ twilio flex:plugins:list:plugins

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/plugins.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/plugins.ts)_

## `twilio flex:plugins:list:releases`

Lists the releases on the account.

```
USAGE
  $ twilio flex:plugins:list:releases

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/list/releases.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/list/releases.ts)_

## `twilio flex:plugins:release`

Creates a Flex Plugin Release. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:release

OPTIONS
  --description=description  The configuration description
  --json
  --major
  --minor
  --new
  --patch

  --plugin=plugin            (required) The plugin to install, formatted as pluginName@version. Use additional --plugin
                             to provide other plugins to install

  --version=version
```

_See code: [src/commands/flex/plugins/release.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/release.ts)_

## `twilio flex:plugins:remove`

Removes the Flex plugin. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:remove

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/remove.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/remove.ts)_

## `twilio flex:plugins:start`

Starts a dev-server to build the Flex plugin locally. This command needs to be invoked inside a plugin directory.

```
USAGE
  $ twilio flex:plugins:start

OPTIONS
  --json
```

_See code: [src/commands/flex/plugins/start.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/plugins/start.ts)_

## `twilio flex:tmp`

```
USAGE
  $ twilio flex:tmp

OPTIONS
  --json
```

_See code: [src/commands/flex/tmp.ts](https://github.com/twilio-labs/plugin-flex/blob/v1.4.0-next.0/src/commands/flex/tmp.ts)_
<!-- commandsstop -->
