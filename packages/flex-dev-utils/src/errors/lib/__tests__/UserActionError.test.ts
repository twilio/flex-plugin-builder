import FlexPluginError from '../FlexPluginError';
import UserActionError from '../UserActionError';

describe('UserActionError', () => {
  const errMsg = 'the-reason';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend FlexPluginError', () => {
    expect(new UserActionError('')).toBeInstanceOf(FlexPluginError);
  });

  it('should pass reason to message', () => {
    const err = new UserActionError(errMsg);

    expect(err.reason).toEqual(errMsg);
    expect(err.message).toEqual(errMsg);
  });

  it('should set reason and message', () => {
    const err = new UserActionError(errMsg, 'the-message');

    expect(err.reason).toEqual(errMsg);
    expect(err.message).toEqual('the-message');
  });
});
