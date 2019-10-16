import { logger } from 'flex-dev-utils';
import * as boxed from 'flex-dev-utils/dist/boxen';

import finalMessage from '../finalMessage';
jest.mock('flex-dev-utils/dist/boxen');

describe('finalMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render an npm setup message to the console', () => {
    let message = '';
    (boxed as any).info = jest.fn((msg) => message = msg);

    finalMessage({} as any);

    expect(boxed.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });

  it('should render a yarn setup message to the console', () => {
    let message = '';
    (boxed as any).info = jest.fn((msg) => message = msg);

    finalMessage({yarn: true} as any);

    expect(boxed.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });

  it('should render an instruction message skipping the setup step', () => {
    let message = '';
    (boxed as any).info = jest.fn((msg) => message = msg);

    finalMessage({install: true} as any);

    expect(boxed.info).toHaveBeenCalledTimes(1);
    expect(message).toMatchSnapshot();
  });
});
