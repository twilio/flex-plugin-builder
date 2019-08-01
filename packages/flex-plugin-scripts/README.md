![npm](https://img.shields.io/npm/v/flex-plugin-scripts.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/flex-plugin-scripts.svg?style=flat-square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-scripts.svg?style=flat-square)](LICENSE.md)

# Flex Plugin Scripts

Scripts to run, build, and deploy Flex plugin.

## Installation

This repo will automatically be installed as part of creating a new plugin.

## Scripts

### Deploy
<!-- include('./docs/deploy.md') -->

### Build
<!-- include('./docs/build.md') -->

### Test
<!-- include('./docs/test.md') -->

### Start
<!-- include('./docs/start.md') -->

### Clear
<!-- include('./docs/clear.md') -->

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
