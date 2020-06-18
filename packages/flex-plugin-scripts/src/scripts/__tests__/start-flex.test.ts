import * as startFlexScripts from '../start-flex';
import * as urlScripts from 'flex-dev-utils/dist/urls';

jest.mock('flex-dev-utils/dist/urls');

describe('StartFlexScript', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    describe('default', () => {
        it('should start a dev-server', async () => {
            const port = 1234;
            const findPorts = jest
                .spyOn(urlScripts, 'findPorts')
                .mockResolvedValue(port);
            const getDefaultPort = jest
                .spyOn(urlScripts, 'getDefaultPort')
                .mockReturnValue(port);
            const _startDevServer = jest
                .spyOn(startFlexScripts, '_startDevServer')
                .mockReturnThis();

            process.env.PORT = '2345';
            await startFlexScripts.default();

            expect(findPorts).toHaveBeenCalledTimes(1);
            expect(findPorts).toHaveBeenCalledWith(port);
            expect(getDefaultPort).toHaveBeenCalledTimes(1);
            expect(getDefaultPort).toHaveBeenCalledWith('2345');
            expect(_startDevServer).toHaveBeenCalledTimes(1);
            expect(_startDevServer).toHaveBeenCalledWith(port);
        });
    });
});