import * as buildScript from '../build';
import * as utilsRequire from '../../utils/require';

jest.mock('../../utils/require');
jest.mock('flex-dev-utils/dist/logger');

describe('build', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should run craco build', () => {
    buildScript.default();
    expect(utilsRequire.runCraco).toHaveBeenCalledTimes(1);
    expect(utilsRequire.runCraco).toHaveBeenCalledWith(buildScript.cracoScriptPath);
  });
});
