import boxen from 'flex-dev-utils/dist/boxen';

import finalMessage from '../finalMessage';
import { FlexPluginArguments } from '../../lib/create-flex-plugin';
jest.mock('flex-dev-utils/dist/boxen');

describe('finalMessage', () => {
  const config: FlexPluginArguments = {
    name: 'plugin-final-message',
    targetDirectory: '/target/directory',
    flexSdkVersion: '1.2.3-flex-sdk',
    flexPluginVersion: '1.2.3-flex-plugin',
    pluginScriptsVersion: '1.2.3-plugin-script',
    pluginClassName: 'PluginFinalMessage',
    pluginNamespace: 'PluginFinalMessage',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render an npm setup message to the console', () => {
    let message = '';
    (boxen as any).info = jest.fn((msg) => message = msg);

    finalMessage(config);

    expect(boxen.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });

  it('should render a yarn setup message to the console', () => {
    let message = '';
    (boxen as any).info = jest.fn((msg) => message = msg);

    finalMessage({...config, yarn: true});

    expect(boxen.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });

  it('should render an instruction message skipping the setup step', () => {
    let message = '';
    (boxen as any).info = jest.fn((msg) => message = msg);

    finalMessage({...config, install: true});

    expect(boxen.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });
});
