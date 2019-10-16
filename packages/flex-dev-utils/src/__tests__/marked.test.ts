import * as fs from 'fs';
import marked from 'marked';
import * as logger from '../logger';
import { render } from '../marked';

jest.mock('fs');
jest.mock('marked');
jest.mock('../logger');

describe('marked', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pipe content in correct order', () => {
    render('foo');
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(marked).toHaveBeenCalledTimes(1);
  });
});
