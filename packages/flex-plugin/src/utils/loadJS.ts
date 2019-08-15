import shortid from './shortid';

/**
 * Loads external JS files into your plugin.
 * Use this method at the beginning of the init() method of the plugin.
 * @param srcArray Array of JS file links to load
 * @return {void}
 */
export const loadJS = (...srcArray: string[]): void => {
    srcArray.forEach((src: string) => {
        const script  = document.createElement('script');

        script.id = `external-js-${shortid()}`;
        script.type = 'text/javascript';
        script.src = src;

        document.body.appendChild(script);
    });
};
