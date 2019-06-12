import shortid from 'shortid';

/**
 * Loads external JS files into your plugin.
 * Use this method at the beginning of the init() method of the plugin.
 * @param srcArray Array of JS file links to load
 * @return {void}
 */
export const loadJS = (...srcArray: string[]): void => {
    srcArray.forEach((src: string) => {
        const head = document.getElementsByTagName('body')[0];
        const script  = document.createElement('script');

        script.id = `external-js-${shortid.generate()}`;
        script.type = 'text/javascript';
        script.src = src;

        head.appendChild(script);
    });
};
