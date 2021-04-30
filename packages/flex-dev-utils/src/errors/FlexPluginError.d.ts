import { TwilioError } from 'flex-plugins-utils-exception';
export default class FlexPluginError extends TwilioError {
    private readonly pkg;
    constructor(msg?: string);
    print: () => void;
    details: () => void;
}
