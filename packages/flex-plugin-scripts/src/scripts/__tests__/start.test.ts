import * as startScript from '../start';
import * as utilsRequire from '../../utils/require';

jest.mock('../../utils/require');
jest.mock('flex-dev-utils/dist/logger');

describe('start', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should run craco start', () => {
    startScript.default();

    expect(utilsRequire.resolve).toHaveBeenCalledTimes(1);
    expect(utilsRequire.resolve).toHaveBeenCalledWith(startScript.cracoScriptPath);
    expect(process.env.BROWSER).toContain('sub/browser.js');
  });
});
