import spawn from '../utils/spawn';

jest.mock('../utils/spawn');

describe('index', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    delete require.cache[require.resolve('../index')];
  });

  it('should do something', () => {

  });
});
