import { logger, singleLineString } from 'flex-dev-utils';

export default (localVersion: string, remoteVersion: string): void => {
  logger.newline();
  logger.warning(
    singleLineString(
      `The React version ${localVersion} installed locally`,
      `is incompatible with the React version ${remoteVersion} installed on your Flex project.`,
    ),
  );
  logger.info(
    singleLineString(
      'Change your local React version or visit https://flex.twilio.com/admin/developers to',
      `change the React version installed on your Flex project.`,
    ),
  );
};
