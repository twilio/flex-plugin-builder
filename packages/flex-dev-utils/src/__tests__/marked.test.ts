import marked from 'marked';
import logger from '../logger';

const readFileSync = jest.fn();
jest.mock('marked');
jest.mock('../logger');
jest.mock('../fs', () => ({
  getCwd: () => 'the-dir',
  readFileSync,
}));

// tslint:disable
const markedScript = require('../marked');
// tslint:enable

describe('marked', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should pipe content in correct order', () => {
    readFileSync.mockReturnValue('fileContent');
    markedScript.render('foo');
    expect(readFileSync).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(marked).toHaveBeenCalledTimes(1);
  });
});