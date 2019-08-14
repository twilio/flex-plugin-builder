import webpack from '../webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

jest.mock('path', () => ({
  join: (...args: string[]) => args.includes('@twilio/flex-ui') ? 'flex-ui' : 'app',
}));

jest.mock('fs', () => ({
  readFileSync: (path: string) => {
    if (path === 'flex-ui') {
      return '{"version":"1.2.3"}';
    } else {
      return '{"name":"app-name"}';
    }
  },
}));

describe('webpack', () => {
  it('has all the required fields', () => {
    const config = webpack.configure({});

    expect(config).toHaveProperty('output');
    expect(config).toHaveProperty('plugins');
    expect(config).toHaveProperty('optimization');
    expect(config).toHaveProperty('resolve');
  });

  it('checks output property', () => {
    const config = webpack.configure({});

    expect(config.output.filename).toEqual('app-name.js');
    expect(config.output.chunkFilename).toEqual('[name].chunk.js');
  });

  it('check externals', () => {
    const config = webpack.configure({});

    expect(config.externals).toHaveProperty('react');
    expect(config.externals).toHaveProperty('react-dom');
    expect(config.externals).toHaveProperty('redux');
    expect(config.externals).toHaveProperty('react-redux');
  });

  it('check plugins', () => {
    const config = webpack.configure({});

    expect(config.plugins.length).toEqual(1);
    expect(config.plugins[0] instanceof CleanWebpackPlugin).toBeTruthy();
  });

  it('check optimization', () => {
    const config = webpack.configure({});

    expect(config.optimization.splitChunks).toBeFalsy();
    expect(config.optimization.runtimeChunk).toBeFalsy();
  });

  it('checks alias', () => {
    const config = webpack.configure({});

    expect(config.resolve.alias).toHaveProperty('@twilio/flex-ui');
    // @ts-ignore
    expect(config.resolve.alias['@twilio/flex-ui']).toEqual('flex-plugin-scripts/dev_assets/flex-shim.js');
  });
});
