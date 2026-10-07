import { logger, env } from '@twilio/flex-dev-utils';

export default (filename: string, key: string): void => {
  env.persistTerminal();

  const isQuiet = env.isQuiet();
  env.setQuiet(false);
  logger.warning(
    `Unsupported variable **${key}** provided in **${filename}** file. Variables must start with either FLEX_APP_ or REACT_APP_.`,
  );
  env.setQuiet(isQuiet);
};
