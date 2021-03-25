import TwilioError from './TwilioError';

export default class TwilioCliError extends TwilioError {
  constructor(msg?: string) {
    super(msg);

    Object.setPrototypeOf(this, TwilioCliError.prototype);
  }
}
