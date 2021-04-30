import { Logger } from 'flex-dev-utils';
declare const _default: (logger: Logger) => {
    archivedSuccessfully: (name: string) => void;
    archivedFailed: (name: string) => void;
    alreadyArchived: (name: string, message: string) => void;
};
export default _default;
