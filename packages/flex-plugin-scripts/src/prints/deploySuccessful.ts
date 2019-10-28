import { logger } from 'flex-dev-utils';
import { singleLineString } from 'flex-dev-utils/dist/strings';
import { Account } from '../clients/account-types';

/**
 * Successful message to print after a deploy
 *
 * @param url       the Asset URL
 * @param isPublic  whether the Asset is uploaded publicly or privately
 * @param account   the account doing the deploy
 */
export default (url: string, isPublic: boolean, account: Account) => {
  const availability = isPublic ? 'publicly' : 'privately';
  const nameLogger = logger.coloredStrings.name;

  logger.newline();
  logger.success(singleLineString(
    '🚀  Your plugin has been successfully deployed to your Flex project',
    `${nameLogger(account.friendly_name)} (${nameLogger(account.sid)}).`,
    `It is hosted (${availability}) as a Twilio Asset on ${logger.coloredStrings.link(url)}.`,
  ));
  logger.newline();
};
