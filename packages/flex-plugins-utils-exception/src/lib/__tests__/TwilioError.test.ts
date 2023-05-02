import TwilioError from '../TwilioError';
import { TwilioApiError } from '../..';

describe('TwilioError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be the error', () => {
    expect(new TwilioError()).toBeInstanceOf(TwilioError);
  });

  it('should return true for instanceOf', () => {
    const apiError = new TwilioApiError(123, 'test', 123);
    const error = new TwilioError();

    expect(apiError.instanceOf(TwilioApiError)).toEqual(true);
    expect(apiError.instanceOf(TwilioError)).toEqual(true);
    expect(apiError.instanceOf(Error)).toEqual(true);

    expect(error.instanceOf(TwilioError)).toEqual(true);
    expect(error.instanceOf(Error)).toEqual(true);
  });

  it('should return false for instanceOf', () => {
    class Foo extends Error {}

    const apiError = new TwilioApiError(123, 'test', 123);
    const error = new TwilioError();
    const noConstuctorError = new TwilioError();

    // @ts-expect-error
    noConstuctorError.constructor = null;

    expect(apiError.instanceOf(Foo)).toEqual(false);
    expect(error.instanceOf(TwilioApiError)).toEqual(false);
    expect(noConstuctorError.instanceOf(Foo)).toEqual(false);
  });
});
