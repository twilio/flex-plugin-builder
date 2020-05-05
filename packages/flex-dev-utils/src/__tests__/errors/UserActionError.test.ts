import FlexPluginError from '../../errors/FlexPluginError';
import UserActionError from '../../errors/UserActionError';

describe('UserActionError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend FlexPluginError', () => {
    expect(new UserActionError("")).toBeInstanceOf(FlexPluginError);
  });

  it('should pass reason to message', () => {
    const err = new UserActionError('the-reason');

    expect(err.reason).toEqual('the-reason');
    expect(err.message).toEqual('the-reason');
  });

  it('should set reason and message', () => {
    const err = new UserActionError('the-reason', 'the-message');

    expect(err.reason).toEqual('the-reason');
    expect(err.message).toEqual('the-message');
  });
});
