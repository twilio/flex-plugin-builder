import FlexPluginError from '../FlexPluginError';
import ValidationError from '../ValidationError';

describe('ValidationError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend FlexPluginError', () => {
    expect(new ValidationError()).toBeInstanceOf(FlexPluginError);
  });
});
