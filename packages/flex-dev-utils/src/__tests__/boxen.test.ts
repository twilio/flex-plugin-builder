import * as boxen from '../boxen';
import logSymbol from 'log-symbols';

describe('boxen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should log as warning with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });
    const symbol = logSymbol.warning;

    boxen.warning('the-warning');

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('warning', `${symbol} the-warning ${symbol}`);

    print.mockRestore();
  });

  it('should log as warning without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });

    boxen.warning('the-warning', false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('warning', 'the-warning');

    print.mockRestore();
  });

  it('should log as error with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });
    const symbol = logSymbol.error;

    boxen.error('the-error');

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('error', `${symbol} the-error ${symbol}`);

    print.mockRestore();
  });

  it('should log as error without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });

    boxen.error('the-error', false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('error', 'the-error');

    print.mockRestore();
  });

  it('should log as info with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });
    const symbol = logSymbol.info;

    boxen.info('the-info');

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('info', `${symbol} the-info ${symbol}`);

    print.mockRestore();
  });

  it('should log as info without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });

    boxen.info('the-info', false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('info', 'the-info');

    print.mockRestore();
  });

  it('should log as success with symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });
    const symbol = logSymbol.success;

    boxen.success('the-success');

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('success', `${symbol} the-success ${symbol}`);

    print.mockRestore();
  });

  it('should log as success without symbol', () => {
    const print = jest.spyOn(boxen, 'print').mockImplementation(() => { /* no-op */ });

    boxen.success('the-success', false);

    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith('success', 'the-success');

    print.mockRestore();
  });
});
