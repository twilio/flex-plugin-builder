describe('WebpackConfiguration', () => {
  describe('getJSScripts', () => {
    const getJSScripts = () => require('../webpack.config')._getJSScripts;

    it('should return flex-ui only', () => {
      const scripts = getJSScripts()('1.18.0', '', '');

      expect(scripts).toHaveLength(1);
      expect(scripts[0]).toContain('flex-ui');
      expect(scripts[0]).toContain('1.18.0');
      expect(scripts[0]).toContain('twilio-flex.min.js');
    });

    it('should return flex-ui and react/dom', () => {
      const scripts = getJSScripts()('1.19.0', '16.13.1', '16.12.1');

      expect(scripts).toHaveLength(3);
      expect(scripts[0]).toContain('umd/react.development');
      expect(scripts[0]).toContain('16.13.1');
      expect(scripts[1]).toContain('umd/react-dom.development');
      expect(scripts[1]).toContain('16.12.1');
      expect(scripts[2]).toContain('flex-ui');
      expect(scripts[2]).toContain('1.19.0');
      expect(scripts[2]).toContain('twilio-flex.unbundled-react.min.js');
    });
  });
});
