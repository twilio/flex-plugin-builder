import { TwilioError } from 'flex-plugins-utils-exception';

export default class TwilioCliError extends TwilioError {
  constructor(msg?: string) {
    super(msg);

    Object.setPrototypeOf(this, TwilioCliError.prototype);
  }
}
