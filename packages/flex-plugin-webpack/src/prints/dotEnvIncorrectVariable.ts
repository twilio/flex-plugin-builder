import { logger, env } from 'flex-dev-utils';

export default (filename: string, key: string): void => {
  env.persistTerminal();

  logger.warning(
    `Unsupported variable **${key}** provided in **${filename}** file. Variables must start with either FLEX_APP_ or REACT_APP_.`,
  );
};
