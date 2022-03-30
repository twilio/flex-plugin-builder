import { env, logger } from '@twilio/flex-dev-utils';
import { printList } from '@twilio/flex-dev-utils/dist/prints';

export default (type: 'bundle' | 'sourcemap', size: number, max: number): void => {
  env.setQuiet(false);

  // Round to 1 decimal
  size = Math.round(size * 10) / 10;

  logger.newline();
  logger.info(`--Plugin ${type} size **${size}MB** exceeds allowed limit of **${max}MB**.--`);
  logger.newline();
  logger.info('Consider the following optimizations:');

  const lines = [
    'Host your image files on Twilio Assets instead of bundling them with your plugin',
    'Use SVG instead of PNG/JPEG/GIF image formats',
  ];
  printList(...lines);

  env.setQuiet(true);
};
