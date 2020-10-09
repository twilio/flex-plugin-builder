require('babel-polyfill');

const configure = require('enzyme/build').configure;
const Adapter = require('enzyme-adapter-react-16/build');

configure({
  adapter: new Adapter(),
});
