import execa from 'execa';
import fs from 'fs';
import rimRaf from 'rimraf';

import createFlexPlugin from '../create-flex-plugin';

jest.mock('flex-dev-utils/dist/logger');

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
