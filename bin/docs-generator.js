#!/usr/bin/env node

const glob = require('glob');
const fs = require('fs');
const path = require('path');
const pipe = require('@k88/pipe-compose').pipe;

const inlineCommentsRegex = /<!--[\S\s]*-->/;
const includeRegex = /docs-generator:include\(['"]?([\w\/.]*)['"]?\)/;
const docStartRegex = /docs-generator:start/;
const docEndRegex = /docs-generator:end/;

const docStartComment = '<!-- docs-generator:start - Do not remove or modify this section -->';
const docEndComment = '<!-- docs-generator:end - Do not remove or modify this section -->';

const rootDir = path.dirname(__dirname);
const pattern = `${rootDir}/packages/**/docs.config.js`;
const packages = glob.sync(pattern, { ignore: '**/node_modules/**' });

/**
 * Validates the configuration format
 *
 * @param config
 * @returns boolean
 */
const validateConfig = (config) => config.main && config.output;

/**
 * Flattens array
 *
 * @param arr
 * @returns {*[]}
 */
const flatten = (arr) => [].concat.apply([], arr);

/**
 * Reads the file
 *
 * @param filePath    the file path
 * @returns {string}  the file content
 */
const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

/**
 * Looks up for `<!-- include('/path') --!>` and includes the content
 *
 * @param dir
 * @returns {function(*): *[]}
 */
const addInclude = (dir) => {
  return lines => {
    const newLines = lines.map(line => {
      if (!inlineCommentsRegex.test(line)) {
        return line;
      }

      const match = line.match(includeRegex);
      if (!match || !match.length) {
        return line;
      }

      const file = readFile(path.join(dir, match[1]));
      const newLine = [
        line,
        docStartComment,
        file.split('\n'),
        docEndComment,
      ];

      return flatten(newLine);
    });

    return flatten(newLines);
  }
};

/**
 * Cleans up/removes all the auto-generated lines
 * @param lines
 * @returns {*}
 */
const cleanGeneratedLines = (lines) => {
  const docStartLines = [];
  const docEndLines = [];

  lines.forEach((line, index) => {
    if (!inlineCommentsRegex.test(line)) {
      return;
    }

    if (docStartRegex.test(line)) {
      docStartLines.push(index);
    }

    if (docEndRegex.test(line)) {
      docEndLines.push(index);
    }
  });

  if (docEndLines.length !== docStartLines.length) {
    console.error('Found unmatched docs-generator blocks');
    return lines;
  }

  const start = docStartLines.reverse();
  const end = docEndLines.reverse();

  while (start.length) {
    const startIndex = start.pop();
    const endIndex = end.pop();

    lines.splice(startIndex, endIndex - startIndex + 1);
  }

  return lines;
};

/**
 * Main script generator
 * @param dir
 */
const generate = (dir) => {
  const config = require(path.join(dir, 'docs.config.js'));
  if (!validateConfig(config)) {
    console.error('Configuration for %s is invalid', dir);
    return;
  }

  const main = readFile(path.join(dir, config.main));
  const output = path.join(dir, config.output);

  const lines = main.split('\n');
  const formattedLines = pipe(lines, cleanGeneratedLines, addInclude(dir));

  fs.writeFileSync(output, formattedLines.join('\n'));
};

packages
  .map(path.dirname)
  .forEach(generate);
