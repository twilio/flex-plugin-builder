# Troubleshooting & FAQ

#### npm install fails on NPM 7

If you are using `npm 7` (you can find out the version by typing `npm -v` in your terminal), then you may get the following error when you run `npm install`:

```bash
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^16.14.0" from react-test-renderer@16.14.0
npm ERR! node_modules/enzyme-adapter-react-16/node_modules/react-test-renderer
npm ERR!   react-test-renderer@"^16.0.0-0" from enzyme-adapter-react-16@1.15.5
npm ERR!   node_modules/enzyme-adapter-react-16
npm ERR!     enzyme-adapter-react-16@"^1.14.0" from flex-plugin-test@4.3.5-beta.0
npm ERR!     node_modules/flex-plugin-test
npm ERR!       flex-plugin-test@"^4.3.5-beta.0" from flex-plugin-scripts@4.3.5-beta.0
npm ERR!       node_modules/flex-plugin-scripts
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```

To fix this problem, update your package.json and include the `react-test-renderer` package and use the exact same version you've used for your `react` package.

blah
