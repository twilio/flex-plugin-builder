import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { pipe } from '@k88/pipe-compose';

import { readFileSync } from './fs';
import { logger } from '.';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

/**
 * Renders the markdown file
 *
 * @param filePath  path to markdown file
 */
export const render = (filePath: string) => pipe(filePath, readFileSync, marked, logger.info);

export default marked;
