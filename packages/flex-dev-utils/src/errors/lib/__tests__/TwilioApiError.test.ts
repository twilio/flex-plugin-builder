import TwilioError from '../TwilioError';
import TwilioApiError from '../TwilioApiError';

describe('TwilioApiError', () => {
  const errMsg = 'the-message';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend TwilioError', () => {
    expect(new TwilioApiError(123, 'message', 123)).toBeInstanceOf(TwilioError);
  });

  it('should be of its instance', () => {
    expect(new TwilioApiError(123, 'message', 123)).toBeInstanceOf(TwilioApiError);
  });

  it('should have required properties set', () => {
    const err = new TwilioApiError(456, errMsg, 400);

    expect(err.status).toEqual(400);
    expect(err.code).toEqual(456);
    expect(err.message).toEqual(errMsg);
    expect(err.moreInfo).toBeUndefined();
  });

  it('should have all properties set', () => {
    const err = new TwilioApiError(456, errMsg, 400, 'more-info');

    expect(err.status).toEqual(400);
    expect(err.code).toEqual(456);
    expect(err.message).toEqual(errMsg);
    expect(err.moreInfo).toEqual('more-info');
  });
});
