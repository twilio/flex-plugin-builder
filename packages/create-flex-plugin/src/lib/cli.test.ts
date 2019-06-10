import cli from './cli';
import createFlexPlugin from './create-flex-plugin';

jest.mock('../../src/lib/create-flex-plugin');

describe('cli', () => {
    it('should call createFlexPlugin', () => {
        cli().parse();

        expect(createFlexPlugin).toHaveBeenCalled();
    });
});
