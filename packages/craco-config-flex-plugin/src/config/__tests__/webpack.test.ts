import webpack from '../webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

jest.mock('path', () => ({
  join: (...args: string[]) => args.includes('@twilio/flex-ui') ? 'flex-ui' : 'app'
}));

jest.mock('fs', () => ({
  readFileSync: (path: string) => {
    if (path === 'flex-ui') {
      return '{"version":"1.2.3"}';
    } else {
      return '{"name":"app-name"}';
    }
  }
}));

describe('webpack', () => {
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
});
