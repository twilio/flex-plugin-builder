import TwilioError from './TwilioError';
/**
 *w
 * A Twilio REST API Error response
 * @link https://www.twilio.com/docs/usage/twilios-response#response-formats-exceptions
 */
export default class TwilioApiError extends TwilioError {
    readonly code: number;
    readonly message: string;
    readonly moreInfo?: string;
    readonly status: number;
    constructor(code: number, message: string, status: number, moreInfo?: string);
}
