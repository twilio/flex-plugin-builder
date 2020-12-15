import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { pipe } from '@k88/pipe-compose';

import { readFileSync } from './fs';
import logger from './logger';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

/**
 * Renders the markdown file
 *
 * @param filePath  path to markdown file
 */
// eslint-disable-next-line import/no-unused-modules
export const render = (filePath: string): void => pipe(filePath, readFileSync, marked, logger.info);

// eslint-disable-next-line import/no-unused-modules
export default marked;
