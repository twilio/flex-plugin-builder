import updateNotifier, { NotifyOptions, Settings } from 'update-notifier';
export default updateNotifier;
/**
 * Checks for update for the package
 */
export declare const checkForUpdate: (settings?: Partial<Settings>, customMessage?: Partial<NotifyOptions>) => Promise<void>;
