## 2.0.0 (XXX)

Create Flex Plugin 2.0 upgrades to the latest
[reate React App 3](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md).


# Highlights

* Create React App 3.0 support
* Craco (Create React App Configuration Override)
* Drops React-App-Rewired
* Jest 24

# Migrating from 1.x to 2.x

Update your global `create-flex-plugin` by running:

```bash
npm install --global create-flex-plugin
```

To update existing plugins, edit `package.json` and modify `scripts` and
`dependencies`

```json
{
    "scripts": {
        "bootstrap": "flex-check-start",
        "postinstall": "npm run bootstrap",
        "prestart": "npm run bootstrap",
        "start": "craco start",
        "build": "craco build",
        "test": "craco test --env=jsdom",
        "eject": "craco eject"
    },
    "dependencies": {
        "@craco/craco": "^5.0.2",
        "flex-plugin": "^2.0.0",
        "craco-config-flex-plugin": "^2.0.0",
    }
}
```

Then add a `craco.config.js` and paste the following:

```js
const config = require('craco-config-flex-plugin');

module.exports = {
     ...config,
     plugins: [
          // You can customize the configuration by defining your own plugins.
          // See https://github.com/sharegate/craco/tree/master/packages/craco#develop-a-plugin
          // for more detail
     ]
};
```

Re-run `npm install` to install/update the new dependencies.

## Breaking Changes

Create Flex Plugin upgrades from Create React App 1.x to Create React
App 3.x. Please check the CHANGELOG and migration plan on
[CHANGELOG 1.x to 2.x](https://github.com/facebook/create-react-app/blob/master/CHANGELOG-2.x.md)
and
[CHANGELOG 2.x to 3.x](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md)
on the official Create React App GitHub page.

## New Features

### Create React App 3

Please visit
[Create React App](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md)
for all the new changes added to Create React App 3.x.

### Craco

We have dropped the usage of React App Rewired and instead have added
support for
[Create React App Configuration Override](https://github.com/sharegate/craco). 

You can now easily provide your own configuration override for all
Create React App options by editing the `craco.config.js`. You can
easily create
[plugins](https://github.com/sharegate/craco/blob/master/packages/craco/README.md#develop-a-plugin)
and add them to `craco.config.js`.
