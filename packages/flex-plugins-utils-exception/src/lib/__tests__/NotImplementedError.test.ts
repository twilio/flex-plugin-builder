import { TwilioError, NotImplementedError, TwilioCliError } from '../..';

describe('NotImplementedError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend NotImplementedError', () => {
    expect(new NotImplementedError()).toBeInstanceOf(NotImplementedError);
    expect(new NotImplementedError()).toBeInstanceOf(TwilioError);
    expect(new NotImplementedError()).toBeInstanceOf(TwilioCliError);
  });
});
