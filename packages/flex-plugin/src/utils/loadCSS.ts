import shortid from './shortid';

/**
 * Loads external CSS files into your plugin
 * Use this method at the beginning of the init() method of the plugin
 * @param hrefArray Array of CSS file links to load
 * @return {void}
 */
export const loadCSS = (...hrefArray: string[]): void => {
  hrefArray.forEach((href: string) => {
    const link = document.createElement('link');

    link.id = `external-css-${shortid()}`;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'all';
    link.href = href;

    document.head.appendChild(link);
  });
};
