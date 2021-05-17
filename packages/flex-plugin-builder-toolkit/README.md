![npm](https://img.shields.io/npm/v/flex-plugin-builder-toolkit.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugin-builder-toolkit.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-builder-toolkit.svg?style=square)](../../LICENSE)

# Flex Plugin Toolkit

A wrapper for flex-plugin-scripts to invoke the scripts.

## Installation

Install using

```bash
npm install flex-plugin-builder-toolkit --save
```

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to set up the project.

```bash
# Install dependencies and link local packages with each other
cd packages/flex-plugin-builder-toolkit
npx lerna bootstrap

# Run tests
npm test

# To use your local package in a different project
npm link
# then in a different project
npm link flex-plugin-builder-toolkit
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

[MIT](../../LICENSE)
