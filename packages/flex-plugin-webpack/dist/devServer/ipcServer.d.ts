import webpack from 'webpack';
import ToJsonOutput = webpack.Stats.ToJsonOutput;
export declare enum IPCType {
    onCompileComplete = "onCompileComplete",
    onDevServerCrashed = "onDevServerCrashed",
    onEmitAllCompilesComplete = "onEmitAllCompilesComplete"
}
export interface OnCompileCompletePayload {
    result: ToJsonOutput;
    appName: string;
    lastPluginBundle: boolean;
}
export interface OnDevServerCrashedPayload {
    exception: {
        message: string;
        stack?: string;
    };
}
export interface IPCPayload {
    onCompileComplete: OnCompileCompletePayload;
    onDevServerCrashed: OnDevServerCrashedPayload;
    onEmitAllCompilesComplete: unknown;
}
declare type MessageCallback<T extends IPCType> = (payload: IPCPayload[T]) => void;
export declare const isServerRunning: () => boolean;
export declare const isClientConnected: () => boolean;
/**
 * Processes the emit queue
 * @private
 */
export declare const _processEmitQueue: () => Promise<void>;
/**
 * Processes the on server message
 * @param data
 * @private
 */
export declare const _onServerMessage: (data: {
    payload: unknown;
    type: string;
}) => void;
/**
 * Processes on client connected
 * @private
 */
export declare const _onClientConnected: () => Promise<void>;
/**
 * Emits to the server
 * @param type      the event type
 * @param payload   the event payload
 * @private
 */
export declare const _emitToServer: <T extends IPCType>(type: T, payload: IPCPayload[T]) => Promise<void>;
/**
 * Starts an IPC server
 */
export declare const startIPCServer: () => void;
/**
 * Starts an IPC Client
 */
export declare const startIPCClient: () => void;
/**
 * onMessage event for the IPC server
 * @param type
 * @param callback
 */
export declare const onIPCServerMessage: <T extends IPCType>(type: T, callback: MessageCallback<T>) => void;
/**
 * Emits to the server that all of the JS Bundles have completed compiling
 * @param payload
 * @returns
 */
export declare const emitAllCompilesComplete: () => Promise<void>;
/**
 * Emits a compilation complete event
 * @param payload
 */
export declare const emitCompileComplete: (payload: OnCompileCompletePayload) => Promise<void>;
/**
 * Emits a dev-server failed event
 * @param error
 */
export declare const emitDevServerCrashed: (error: Error) => Promise<void>;
export {};
