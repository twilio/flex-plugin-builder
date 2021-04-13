![npm](https://img.shields.io/npm/v/flex-plugins-utils-spawn.svg?style=square)
![npm](https://img.shields.io/npm/dt/flex-plugins-utils-spawn.svg?style=square)
[![NpmLicense](https://img.shields.io/npm/l/flex-plugins-utils-spawn.svg?style=square)](../../LICENSE)

# Flex Plugin Utils Spawn

A simple wrapper for the [execa](https://github.com/sindresorhus/execa) library.

## Usage

This library returns 4 methods:

### spawn

The default spawn export is for spawning any process.

```js
import spawn from 'flex-plugins-utils-spawn';

const { stdout, exitCode, stderr, stdout } = await spawn('node', ['index.js', '--name', 'test'], options);
```

### node

This is a wrapper that spawns a node process.

```js
import { node } from 'flex-plugins-utils-spawn';

const { stdout, exitCode, stderr, stdout } = await node(['index.js', '--name', 'test'], options);

// This is just a wrapper and is identical to
const { stdout, exitCode, stderr, stdout } = await spawn('node', ['index.js', '--name', 'test'], options);
```

### npm

This is a wrapper that spawns a npm process.

```js
import { npm } from 'flex-plugins-utils-spawn';

const { stdout, exitCode, stderr, stdout } = await npm(['index.js', '--name', 'test'], options);

// This is just a wrapper and is identical to
const { stdout, exitCode, stderr, stdout } = await spawn('npm', ['index.js', '--name', 'test'], options);
```

### yarn

This is a wrapper that spawns a yarn process.

```js
import { yarn } from 'flex-plugins-utils-spawn';

const { stdout, exitCode, stderr, stdout } = await yarn(['index.js', '--name', 'test'], options);

// This is just a wrapper and is identical to
const { stdout, exitCode, stderr, stdout } = await spawn('yarn', ['index.js', '--name', 'test'], options);
```
