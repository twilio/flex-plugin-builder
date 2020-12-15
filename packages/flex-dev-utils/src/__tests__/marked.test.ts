import marked from 'marked';

import logger from '../logger';

const readFileSync = jest.fn();
jest.mock('marked');
jest.mock('../logger');
jest.mock('../fs', () => ({
  getCwd: () => 'the-dir',
  readFileSync,
}));

/* eslint-disable */
const markedScript = require('../marked');
/* eslint-enable */

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
