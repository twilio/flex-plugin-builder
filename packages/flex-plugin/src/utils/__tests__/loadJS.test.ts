import { loadJS } from '../loadJS';

describe('loadJS', () => {
  const JS_LINK = 'https://my-publicly-accessible-domain.com/test.js';
  const JS_LINK_2 = 'https://my-publicly-accessible-domain.com/test-2.js';

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('should load the JS file into the body', () => {
    expect(document.body.getElementsByTagName('script').length).toBe(0);

    loadJS(JS_LINK);

    const scripts = document.body.getElementsByTagName('script');
    expect(scripts.length).toBe(1);
    expect(scripts[0].src).toBe(JS_LINK);

    expect(document.head.getElementsByTagName('script').length).toBe(0);
  });

  it('should load the multiple CSS files into the head', () => {
    expect(document.body.getElementsByTagName('script').length).toBe(0);

    loadJS(JS_LINK, JS_LINK_2);

    const scripts = document.body.getElementsByTagName('script');
    expect(scripts.length).toBe(2);
    expect(scripts[0].src).toBe(JS_LINK);
    expect(scripts[1].src).toBe(JS_LINK_2);

    expect(document.head.getElementsByTagName('script').length).toBe(0);
  });
});
