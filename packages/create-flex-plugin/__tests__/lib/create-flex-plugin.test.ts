import * as execa from 'execa';
import * as fs from 'fs';
import * as rimRaf from 'rimraf';
import createFlexPlugin from '../../src/lib/create-flex-plugin';

jest.mock('execa');
jest.mock('../../src/utils/logging');

describe('create-flex-plugin', () => {
    const accountSid = 'AC00000000000000000000000000000000';
    const pluginName = 'plugin-test';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (fs.existsSync(pluginName)) {
            rimRaf.sync(pluginName);
        }
    });

    describe('createFlexPlugin', () => {

        it('should not install any dependency by default', async () => {
            // Act
            await createFlexPlugin({
               name: pluginName,
               accountSid,
            } as any);

            // Assert
            expect(execa).not.toHaveBeenCalled();
        });

        it('should install the dependencies if specified', async () => {
            // Act
            await createFlexPlugin({
                name: pluginName,
                accountSid,
                install: true,
            } as any);

            // Assert
            expect(execa).toHaveBeenCalled();
        });
    });
});
