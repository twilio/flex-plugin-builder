import { TrackParams } from '@segment/analytics-node';
export declare const track: (payload: TrackParams) => void;
declare type TelemetryOpts = {
    /**
     * If set to `true` calls Segment APIs in a daemon process asynchronously
     */
    runAsync?: boolean;
};
export default class Telemetry {
    private commonProperties;
    private runAsync;
    /**
     * Creates an analytics instance
     *
     */
    constructor({ runAsync }?: TelemetryOpts);
    /**
     * Records any event or actions that users perform.
     * @param event Event name
     * @param properties Event properties
     */
    track(event: string, accountSid: string, properties?: Record<string, any>): void;
    private getOsDetails;
    private getRealm;
}
export {};
