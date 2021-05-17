import { loadCSS } from '../loadCSS';

describe('loadCSS', () => {
  const CSS_LINK = 'https://my-publicly-accessible-domain.com/test.css';
  const CSS_LINK_2 = 'https://my-publicly-accessible-domain.com/test-2.css';

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('should load the CSS file into the head', () => {
    expect(document.head.getElementsByTagName('link').length).toBe(0);

    loadCSS(CSS_LINK);

    const links = document.head.getElementsByTagName('link');
    expect(links.length).toBe(1);
    expect(links[0].href).toBe(CSS_LINK);

    expect(document.body.getElementsByTagName('link').length).toBe(0);
  });

  it('should load the multiple CSS files into the head', () => {
    expect(document.head.getElementsByTagName('link').length).toBe(0);

    loadCSS(CSS_LINK, CSS_LINK_2);

    const links = document.head.getElementsByTagName('link');
    expect(links.length).toBe(2);
    expect(links[0].href).toBe(CSS_LINK);
    expect(links[1].href).toBe(CSS_LINK_2);

    expect(document.body.getElementsByTagName('link').length).toBe(0);
  });
});
