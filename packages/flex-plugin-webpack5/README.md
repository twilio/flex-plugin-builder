![npm](https://img.shields.io/npm/v/flex-plugin-webpack5.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugin-webpack5.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugin-webpack5.svg?style=square)](../../LICENSE)

# Flex Plugin Webpack 5

Webpack 5 configurations for building and running Flex plugins - the Webpack 5 counterpart to
[`@twilio/flex-plugin-webpack`](../flex-plugin-webpack), which remains on Webpack 4 and is still the default.

This package is not used directly; it is consumed by
[`@twilio/flex-plugin-scripts`](../flex-plugin-scripts), which selects between the two webpack
major versions based on the `--wp5` flag passed to the `flex-plugin build`/`flex-plugin start`
scripts (surfaced through the `twilio flex:plugins:build`/`twilio flex:plugins:start` CLI commands
as `--wp5`).

Because a project can only ever depend on one version of a given npm package at a time, every
export from this package is named with a `Wp5` suffix (`webpackFactoryWp5`, `compilerWp5`,
`WebpackTypeWp5`, and so on) so it can be imported side by side with `@twilio/flex-plugin-webpack`'s
un-suffixed equivalents without collisions. Its Webpack-version-specific dependencies (`webpack`,
`webpack-dev-server`, `html-webpack-plugin`, `terser-webpack-plugin`, etc.) are similarly installed
under aliased package names (e.g. `webpack5`, `html-webpack-plugin-wp5`) so both webpack majors can
coexist in the same `node_modules` tree without version conflicts.

## Notable differences from `@twilio/flex-plugin-webpack`

- Uses `fork-ts-checker-webpack-plugin@^9`, a modern, actively maintained major version compatible
  with current TypeScript syntax - unlike webpack 4's still-pinned `^4.1.6`. TypeScript type-checking
  prefers the **plugin project's own installed TypeScript** version over this package's own, so a
  plugin's dependencies (e.g. newer `@twilio/flex-ui`/`@apollo/client` releases using modern
  `.d.ts` syntax) are checked with a compatible compiler rather than failing against a stale one.
- Targets Webpack 5's APIs directly (asset modules, the new `Stats` schema, `processAssets` hooks)
  rather than Webpack 4's.

## Contributors

Thank you to all the lovely contributors to this project. Please check the main repository to see [all contributors](https://github.com/twilio/flex-plugin-builder#contributors).

## License

[MIT](../../LICENSE)
