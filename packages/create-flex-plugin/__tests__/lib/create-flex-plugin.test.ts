import * as execa from 'execa';
import createFlexPlugin from '../../src/lib/create-flex-plugin';

jest.mock('execa');
jest.mock('../../src/utils/logging');

describe('create-flex-plugin', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('createFlexPlugin', () => {
        it(`should not install any dependency by default`, async () => {
            // Act
            await createFlexPlugin({
               name: 'plugin-test',
               accountSid: 'fake-sid',
            } as any);

            // Assert
            expect(execa).not.toHaveBeenCalled();
        });

        test(`should install the dependencies if specified`, async () => {
            // Act
            await createFlexPlugin({
                name: 'plugin-test',
                accountSid: 'fake-sid',
                install: true,
            } as any);

            // Assert
            expect(execa).toHaveBeenCalled();
        });
    });
});
