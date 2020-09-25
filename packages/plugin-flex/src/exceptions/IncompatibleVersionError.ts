import TwilioCliError from './TwilioCliError';

export default class IncompatibleVersionError extends TwilioCliError {
  constructor(name: string, version?: number | null) {
    super(`The plugin ${name} version (v${version}) is not compatible with this CLI command.`);

    Object.setPrototypeOf(this, IncompatibleVersionError.prototype);
  }
}
