import { logger, env, singleLineString } from '@twilio/flex-dev-utils';

export default (count: number): void => {
  const { bold } = logger.colors;
  const { link } = logger.coloredStrings;

  env.setQuiet(false);
  logger.error('There must be one and only one plugin loaded in each Flex plugin.');
  logger.newline();
  logger.info(
    singleLineString(
      `There are ${bold(count.toString())} plugin(s) being loaded in this source code.`,
      `Check that the ${bold('src/index')} file contains only one call to`,
      `${bold('FlexPlugin.loadPlugin(...)')}.`,
      `For more information, please refer to ${link('https://www.twilio.com/docs/flex/plugins')}.`,
    ),
  );
  logger.newline();
  env.setQuiet(true);
};
