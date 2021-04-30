import { FlexPluginError } from '.';
export default class UserActionError extends FlexPluginError {
    readonly reason: string;
    constructor(reason: string, message?: string);
}
