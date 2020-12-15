/**
 * Exits unless --no-process-exit flag is provided
 *
 * @param exitCode  the exitCode
 * @param args      the process argument
 */
const exit = (exitCode: number, args: string[] = []): void => {
  // Exit if not an embedded script
  if (!args.includes('--no-process-exit')) {
    // eslint-disable-next-line no-process-exit
    process.exit(exitCode);
  }
};

export default exit;
