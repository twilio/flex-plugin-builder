interface Service {
    unique_name: string;
    sid: string;
}
export declare const getServiceSid: () => Promise<Service>;
export declare const deleteEnvironments: (serviceSid: string) => Promise<void>;
export {};
