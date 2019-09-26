import fs from 'fs';
import { SourceMapDevToolPlugin } from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

import * as utilsFs from '../../utils/fs';

jest.mock('path', () => ({
  join: (...args: string[]) => args.includes('@twilio/flex-ui') ? 'flex-ui' : 'app',
}));

jest.mock('fs');
fs.readFileSync = jest.fn().mockImplementation((path: string) => {
  if (path === 'flex-ui') {
    return '{"version":"1.2.3"}';
  } else {
    return '{"name":"app-name"}';
  }
});

describe('webpack', () => {
  it('has all the required fields', () => {
    const webpack = require('../webpack').default;
    const config = webpack.configure({});

    expect(config).toHaveProperty('output');
    expect(config).toHaveProperty('plugins');
    expect(config).toHaveProperty('optimization');
    expect(config).toHaveProperty('resolve');
  });

  it('checks output property', () => {
    const webpack = require('../webpack').default;
    const config = webpack.configure({});

    expect(config.output.filename).toEqual('app-name.js');
    expect(config.output.chunkFilename).toEqual('[name].chunk.js');
  });

  it('check externals', () => {
    const webpack = require('../webpack').default;
    const config = webpack.configure({});

    expect(config.externals).toHaveProperty('react');
    expect(config.externals).toHaveProperty('react-dom');
    expect(config.externals).toHaveProperty('redux');
    expect(config.externals).toHaveProperty('react-redux');
  });

  it('check plugins', () => {
    const webpack = require('../webpack').default;
    const config = webpack.configure({});

    expect(config.plugins.length).toEqual(2);
    expect(config.plugins[0] instanceof CleanWebpackPlugin).toBeTruthy();
    expect(config.plugins[1] instanceof SourceMapDevToolPlugin).toBeTruthy();
  });

  it('check optimization', () => {
    const webpack = require('../webpack').default;
    const config = webpack.configure({});

    expect(config.optimization.splitChunks).toBeFalsy();
    expect(config.optimization.runtimeChunk).toBeFalsy();
  });

  it('checks alias', () => {
    const webpack = require('../webpack').default;
    const config = webpack.configure({});

    expect(config.resolve.alias).toHaveProperty('@twilio/flex-ui');
    // @ts-ignore
    expect(config.resolve.alias['@twilio/flex-ui']).toEqual('flex-plugin-scripts/dev_assets/flex-shim.js');
  });

  it('should load custom config', () => {
    const webpack = require('../webpack').default;
    const loadFile = jest
      .spyOn(utilsFs, 'loadFile')
      .mockReturnValue({
        name: 'foo',
        devServer: { public: 'bar' },
      });

    const config = webpack.configure({});

    expect(config.name).toEqual('foo');
    expect(config).not.toHaveProperty('devServer');

    loadFile.mockRestore();
  });
});
