import { logger, singleLineString } from '@twilio/flex-dev-utils';

import { Account } from '../clients/accounts';

/**
 * Successful message to print after a deploy
 *
 * @param url       the Asset URL
 * @param isPublic  whether the Asset is uploaded publicly or privately
 * @param account   the account doing the deploy
 */
export default (url: string, isPublic: boolean, account: Account): void => {
  const availability = isPublic ? 'publicly' : 'privately';
  const nameLogger = logger.coloredStrings.name;
  const friendlyName = account.friendly_name || account.sid;
  const accountSid = (friendlyName !== account.sid && ` (${nameLogger(account.sid)})`) || '';

  logger.newline();
  logger.success(
    singleLineString(
      '🚀  Your plugin has been successfully deployed to your Flex project',
      `${nameLogger(friendlyName)}${accountSid}.`,
      `It is hosted (${availability}) as a Twilio Asset on ${logger.coloredStrings.link(url)}.`,
    ),
  );
  logger.newline();
};
