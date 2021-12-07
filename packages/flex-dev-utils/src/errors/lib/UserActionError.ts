import FlexPluginError from './FlexPluginError';

export default class UserActionError extends FlexPluginError {
  public readonly reason: string;

  constructor(reason: string, message?: string) {
    /* istanbul ignore next */
    super(message || reason);

    this.reason = reason;

    Object.setPrototypeOf(this, UserActionError.prototype);
  }
}
