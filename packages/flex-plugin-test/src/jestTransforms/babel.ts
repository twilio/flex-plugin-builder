/* c8 ignore start */
import babelJest from 'babel-jest';

module.exports = babelJest.createTransformer({
  presets: [require.resolve('babel-preset-react-app')],
  babelrc: false,
  configFile: false,
});
/* c8 ignore stop */
