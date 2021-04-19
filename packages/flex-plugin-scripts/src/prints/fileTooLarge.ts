import { env, logger } from 'flex-dev-utils';
import { printList } from 'flex-dev-utils/dist/prints';

export default (size: number, max: number): void => {
  env.setQuiet(false);

  // Round to 1 decimal
  size = Math.round(size * 10) / 10;

  logger.newline();
  logger.info(`--Plugin bundle size **${size}MB** exceeds allowed **${max}MB**.--`);
  logger.newline();
  logger.info('Consider the following optimization:');

  const lines = [
    'Use SVG instead of PNG/JPEG/GIF image formats',
    'Host your image files on Twilio Assets and other CDN instead of bundling them',
  ];
  printList(...lines);

  env.setQuiet(true);
};
