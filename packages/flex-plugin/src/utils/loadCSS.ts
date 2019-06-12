export const loadCSS = (href: string) => {
    const head = document.getElementsByTagName('head')[0];
    const link  = document.createElement('link');

    link.id   = 'external-css';
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.media = 'all';
    link.href = href;

    head.appendChild(link);
};
