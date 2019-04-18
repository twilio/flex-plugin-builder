const scriptTag = document.createElement('script');
scriptTag.src = 'https://test.twil.io/';

Object.defineProperty(document, 'currentScript', {
    value: scriptTag
});
