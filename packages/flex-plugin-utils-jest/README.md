![npm](https://img.shields.io/npm/v/flex-plugin-utils-jest.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugin-utils-jest.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-utils-jest.svg?style=square)](../../LICENSE)

# Flex Plugin Utils Jest

Jest extensions used throughout Flex Plugin Builder

## Extension

This library provides the following extensions to Jest

### toMatchPath(expected: string)

This method can be used to check for path and is OS agnostic.

```bash
// Use symmetrically
expect('/path/to/file1').toMatchPath('/path/to/file1');

// Use asymmetrically
expect(fn).toHaveBeenCalledWith(expect.toMatchPath('/path/to/file1'));
```

### toMatchPathContaining(expected: string)

Similar to `toMatchPath` but will do partial match

```bash
// Use symmetrically
expect('/path/to/file1').toMatchPathContaining('to/file1');

// Use asymmetrically
expect(fn).toHaveBeenCalledWith(expect.toMatchPathContaining('to/file1'));
```

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

[MIT](../../LICENSE)
