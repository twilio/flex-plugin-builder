import FlexPluginError from '../../errors/FlexPluginError';
import ValidationError from '../../errors/ValidationError';

describe('ValidationError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend FlexPluginError', () => {
    expect(new ValidationError()).toBeInstanceOf(FlexPluginError);
  });
});
