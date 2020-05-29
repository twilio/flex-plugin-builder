import { boxen } from 'flex-dev-utils';

import finalMessage from '../finalMessage';

describe('finalMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render an npm setup message to the console', () => {
    let message = '';
    (boxen as any).info = jest.fn((msg) => message = msg);

    finalMessage({} as any);

    expect(boxen.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });

  it('should render a yarn setup message to the console', () => {
    let message = '';
    (boxen as any).info = jest.fn((msg) => message = msg);

    finalMessage({yarn: true} as any);

    expect(boxen.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });

  it('should render an instruction message skipping the setup step', () => {
    let message = '';
    (boxen as any).info = jest.fn((msg) => message = msg);

    finalMessage({install: true} as any);

    expect(boxen.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });
});
