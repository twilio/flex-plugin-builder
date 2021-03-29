import TwilioCliError from './TwilioCliError';

export default class NotImplementedError extends TwilioCliError {
  constructor() {
    super('Abstract method must be implemented');

    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}
