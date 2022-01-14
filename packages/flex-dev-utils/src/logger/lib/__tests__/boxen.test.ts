import logSymbol from 'log-symbols';

import * as boxen from '../boxen';

describe('boxen', () => {
  const warnMsg = 'the-warning';
  const successMsg = 'the-success';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should log as warning with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });
    const symbol = logSymbol.warning;

    boxen.warning(warnMsg);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('warning', `${symbol} the-warning ${symbol}`);

    print.mockRestore();
  });

  it('should log as warning without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });

    boxen.warning(warnMsg, false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('warning', warnMsg);

    print.mockRestore();
  });

  it('should log as error with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });
    const symbol = logSymbol.error;

    boxen.error('the-error');

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('error', `${symbol} the-error ${symbol}`);

    print.mockRestore();
  });

  it('should log as error without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });

    boxen.error('the-error', false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('error', 'the-error');

    print.mockRestore();
  });

  it('should log as info with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });
    const symbol = logSymbol.info;

    boxen.info('the-info');

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('info', `${symbol} the-info ${symbol}`);

    print.mockRestore();
  });

  it('should log as info without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });

    boxen.info('the-info', false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('info', 'the-info');

    print.mockRestore();
  });

  it('should log as success with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });
    const symbol = logSymbol.success;

    boxen.success(successMsg);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('success', `${symbol} the-success ${symbol}`);

    print.mockRestore();
  });

  it('should log as success without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => {
      /* no-op */
    });

    boxen.success(successMsg, false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('success', successMsg);

    print.mockRestore();
  });
});
