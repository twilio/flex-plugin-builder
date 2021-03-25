import { TwilioError, TwilioCliError } from '../../errors';

describe('TwilioCliError', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should extend TwilioCliError', () => {
    expect(new TwilioCliError()).toBeInstanceOf(TwilioError);
    expect(new TwilioCliError()).toBeInstanceOf(TwilioCliError);
  });
});
