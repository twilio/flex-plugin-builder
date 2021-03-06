import { OnDevServerCrashedPayload } from 'flex-plugin-webpack';
import { logger } from 'flex-dev-utils';

export default (payload: OnDevServerCrashedPayload): void => {
  logger.error('Flex Plugin Builder server has crashed:', payload.exception.message);
  logger.info(payload.exception.stack);
};
