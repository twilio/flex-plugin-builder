import FlexPluginError from './FlexPluginError';

export default class UserActionError extends FlexPluginError {
  public readonly reason: string;

  constructor(reason: string, message?: string) {
    /* c8 ignore next */
    super(message || reason);

    this.reason = reason;

    Object.setPrototypeOf(this, UserActionError.prototype);
  }
}
