import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
import { readFileSync } from './fs';
import * as logger from './logger';
import { pipe } from '@k88/pipe-compose';

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
