/**
 * Sleeps for the given time
 * @param ms time to sleep in milliseconds
 */
export const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
