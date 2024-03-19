import '@babel/polyfill';

jest.mock('@segment/analytics-node', () => {
    const track = jest.fn();
    return {
        __esModule: true,
        default: () => ({
            track,
        }),
    };
});