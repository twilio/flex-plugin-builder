![npm](https://img.shields.io/npm/v/flex-plugin-scripts.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/flex-plugin-scripts.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-scripts.svg?style=flat-square)](LICENSE.md)

# Flex Plugin Scripts

Scripts to run, build, and deploy Flex plugin.

## Installation

This repo will automatically be installed as part of creating a new plugin.

## Scripts

### Release

```bash
npm run release {major, minor, patch, custom, overwrite} {--public}
```

This script will build, and then deploy your plugin bundle to Twilio Assets. Please note that your accountSid and authToken are required to use this script. Your plugins will be uploaded to Twilio Assets using the following format:

```text
https://domain.twil.io/plugins/${PluginName}/${Version}/bundle.js
```

Where `PluginName` is the `name` from `package.json`, and `Version` is the `version` from `package.json`. For example:

```text
https://domain.twil.io/plugins/dialpad/1.0.0/bundle.js
https://domain.twil.io/plugins/dialpad/1.1.0/bundle.js
https://domain.twil.io/plugins/dialpad/1.1.1/bundle.js`
```

You may choose between `major, minor, patch, custom, overwrite` options:

* **major**: A major SemVer release version, e.g. going from 1.2.3 to 2.0.0. 

    `npm run release major` 

* **minor**: A minor SemVer release version, e.g. going from 1.2.3 to 1.3.0. 

    `npm run release minor` 

* **patch**: A patch SemVer release version, e.g. going from 1.2.3 to 1.2.4.

    `npm run release patch`

* **custom**: A custom release version if you are not using SemVer versioning. Provide the version as the next argument.

    `npm run release custom v1.2-someTag`

* **overwrite**: Will overwrite the version. 

    `npm run release overwrite`

By default, all plugins are uploaded as Protected Assets (i.e. they require a Twilio Signature to be accessed). Plugin can be uploaded as a Public Asset using `--public` in your script.

### Build

```bash
npm run build
```

Run this script to build and create a single .js bundle for your plugin. You can then upload this to Twilio Assets or serve it via your own plugin service.

### Test

```bash
npm run build
```

Run this script to test your sourcecode.

### Start

```text
npm run start
```

Run this script to use dev-server for local development.

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to set up the project.

```bash
# Install dependencies and link local packages with each other
cd packages/flex-plugin
npx lerna bootstrap

# Run tests
npm test

# To use your local package in a different project
npm link
# then in a different project
npm link flex-plugin
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

MIT
