export const loadJS = (src: string) => {
    const head = document.getElementsByTagName('body')[0];
    const script  = document.createElement('script');

    script.id = 'external-js';
    script.type = 'text/javascript';
    script.src = src;

    head.appendChild(script);
};
