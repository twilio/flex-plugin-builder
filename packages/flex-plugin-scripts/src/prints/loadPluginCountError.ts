import { logger, singleLineString } from 'flex-dev-utils';

export default (count: number) => {
  const bold = logger.colors.bold;
  const link = logger.coloredStrings.link;

  logger.error('There must be one and only one plugin loaded in each Flex plugin.');
  logger.newline();
  logger.info(singleLineString(
    `There are ${bold(count.toString())} plugin(s) being loaded in this source code.`,
    `Check that the ${bold('src/index')} file contains only one call to`,
    `${bold('FlexPlugin.loadPlugin(...)')}.`,
    `For more information, please refer to ${link('https://www.twilio.com/docs/flex/plugins')}.`,
  ));
  logger.newline();
};
