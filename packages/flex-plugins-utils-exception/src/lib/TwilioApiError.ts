import TwilioError from './TwilioError';

/**
 *w
 * A Twilio REST API Error response
 * @link https://www.twilio.com/docs/usage/twilios-response#response-formats-exceptions
 */
export default class TwilioApiError extends TwilioError {
  public readonly code: number;

  public readonly message: string;

  public readonly moreInfo?: string;

  public readonly status: number;

  constructor(code: number, message: string, status: number, moreInfo?: string) {
    super(message);

    this.code = code;
    this.message = message;
    this.moreInfo = moreInfo;
    this.status = status;

    Object.setPrototypeOf(this, TwilioApiError.prototype);
  }
}
