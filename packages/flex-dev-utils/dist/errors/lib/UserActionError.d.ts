import FlexPluginError from './FlexPluginError';
export default class UserActionError extends FlexPluginError {
    readonly reason: string;
    constructor(reason: string, message?: string);
}
