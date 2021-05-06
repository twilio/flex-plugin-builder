![npm](https://img.shields.io/npm/v/flex-dev-utils.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-dev-utils.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-dev-utils.svg?style=square)](../../LICENSE)

# Flex Dev Utils

Common development utility functions and scripts for Flex plugin creation.

## Installation

These utilities are included by default when you use flex-plugin.

## Contributing

Make sure to follow the instructions in the [main repository](https://github.com/twilio/flex-plugin-builder#contributing) to set up the project.

```bash
# Install dependencies and link local packages with each other
cd packages/flex-dev-utils
npx lerna bootstrap

# Run tests
npm test

# To use your local package in a different project
npm link
# then in a different project
npm link flex-dev-utils
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

[MIT](../../LICENSE)

