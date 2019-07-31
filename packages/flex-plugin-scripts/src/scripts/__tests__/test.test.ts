import * as testScript from '../test';
import * as utilsRequire from '../../utils/require';

jest.mock('../../utils/require');
jest.mock('flex-dev-utils/dist/logger');

describe('test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should run craco test', () => {
    testScript.default();
    expect(utilsRequire.resolve).toHaveBeenCalledTimes(1);
    expect(utilsRequire.resolve).toHaveBeenCalledWith(testScript.cracoScriptPath);
  });
});

