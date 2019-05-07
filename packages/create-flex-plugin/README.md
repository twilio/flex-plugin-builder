![npm](https://img.shields.io/npm/v/create-flex-plugin.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/create-flex-plugin.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/create-flex-plugin.svg?style=flat-square)](LICENSE.md)

# Create Flex Plugin

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
  --template, -t    A GitHub URL that contains your template
  --typescript, -s  Create a typescript project
  --install         Auto-install dependencies         [boolean] [default: false]
  -h, --help        Show help                                          [boolean]
  -v, --version     Show version number                                [boolean]
```

### Creating a Plugin from Custom Template

When creating a new plugin, you may provide a `--template` URL to a GitHub page that contains your custom template. 

#### Template Directory Hierarchy

Your GitHub project should be

```
/
    template/
        src/
            index.js
            ...
        ...
```

Create Flex Plugin will copy over the content from the `template` directory, and expects a `index.js`. 

We will provide a `public/` folder as well as `package.json` but you may override these as well by providing them in your `template/` folder.

See [flex-plugin-template-sample](https://github.com/ktalebian/flex-plugin-template-sample) as an example.

#### Version Support

The `--template` link can contain a reference, which can be a `tag` or a `branch` name. For example 

```
create-flex-plugin --template https://github.com/ktalebian/flex-plugin-template-sample/tree/1.0.0
```

would use the tagged version `1.0.0`, while

```
create-flex-plugin --template https://github.com/ktalebian/flex-plugin-template-sample/tree/master
```

would use the `master` branch.

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
