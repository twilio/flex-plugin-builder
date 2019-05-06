import * as execa from 'execa';
import createFlexPlugin from '../../src/lib/create-flex-plugin';

jest.mock('execa');
jest.mock('../../src/utils/logging');

describe('create-flex-plugin', () => {
    const accountSid = 'AC00000000000000000000000000000000';

    beforeEach(() => jest.clearAllMocks());

    describe('createFlexPlugin', () => {
        it('should not install any dependency by default', async () => {
            // Act
            await createFlexPlugin({
               name: 'plugin-test',
               accountSid,
            } as any);

            // Assert
            expect(execa).not.toHaveBeenCalled();
        });

        it('should install the dependencies if specified', async () => {
            // Act
            await createFlexPlugin({
                name: 'plugin-test',
                accountSid,
                install: true,
            } as any);

            // Assert
            expect(execa).toHaveBeenCalled();
        });
    });
});
