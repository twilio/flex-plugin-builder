import * as validators from '../validators';

describe('validators', () => {
  describe('isInputNotEmpty', () => {
    it('isInputNotEmpty should return false', async () => {
      expect(await validators.isInputNotEmpty('')).toBeFalsy();
    });

    it('isInputNotEmpty should return true', async () => {
      expect(await validators.isInputNotEmpty('1')).toBeTruthy();
    });
  });

  describe('validateAccountSid', () => {
    it('validateAccountSid should return false', async () => {
      expect(await validators.validateAccountSid('')).toBeFalsy();
      expect(await validators.validateAccountSid('AC0000000000000000000000000000000')).toEqual(expect.any(String));
      expect(await validators.validateAccountSid('AB00000000000000000000000000000000')).toEqual(expect.any(String));
    });

    it('validateAccountSid should return true', async () => {
      expect(await validators.validateAccountSid('AC00000000000000000000000000000000')).toBeTruthy();
    });
  });

  describe('validateApiSid', () => {
    it('validateApiKey should return false', async () => {
      expect(await validators.validateApiKey('')).toBeFalsy();
      expect(await validators.validateApiKey('SK0000000000000000000000000000000')).toEqual(expect.any(String));
      expect(await validators.validateApiKey('SA0000000000000000000000000000000')).toEqual(expect.any(String));
    });

    it('validateApiKey should return true', async () => {
      expect(await validators.validateApiKey('SK00000000000000000000000000000000')).toBeTruthy();
    });
  });

  describe('isValidUrl', () => {
    it('should be valid URL', () => {
      const data = [
        'https://wwww.twilio.com',
        'www.twilio.com',
        'twilio.com',
        'https://www.twilio.com/foo/bar/baz',
        'www.twilio.com/foo/bar/baz',
        'twilio.com/foo/bar/baz',
        'https://www.twilio.com/foo/bar/baz?query=true&another=true',
        'www.twilio.com/foo/bar/baz?query=true&another=true',
        'twilio.com/foo/bar/baz?query=true&another=true',
      ];

      data.map(validators.isValidUrl).forEach((resp) => expect(resp).toBeTruthy());
    });

    it('should be invalid URL', () => {
      const data = ['htt://www.twilio.com', 'http:/www.twilio.com', 'twilio. com', 'twilio'];

      data.map(validators.isValidUrl).forEach((resp) => expect(resp).toBeFalsy());
    });
  });

  describe('validateGitHubUrl', () => {
    it('invalid github url', () => {
      expect(validators.validateGitHubUrl('')).toEqual(expect.stringContaining('valid URL'));

      expect(validators.validateGitHubUrl('http')).toEqual(expect.stringContaining('valid URL'));

      expect(validators.validateGitHubUrl('https://twilio.com')).toEqual(expect.stringContaining('GitHub'));
    });

    it('github url', () => {
      expect(validators.validateGitHubUrl('github.com')).toBeTruthy();
      expect(validators.validateGitHubUrl('github.com/org/repo')).toBeTruthy();
    });
  });

  describe('isGitHubUrl', () => {
    it('should be invalid', () => {
      expect(validators.isGitHubUrl('')).toBeFalsy();
      expect(validators.isGitHubUrl('github.ca')).toBeFalsy();
      expect(validators.isGitHubUrl('twilio.com')).toBeFalsy();
    });

    it('should be valid', () => {
      expect(validators.isGitHubUrl('github.com')).toBeTruthy();
      expect(validators.isGitHubUrl('github.com/org/repo')).toBeTruthy();
    });
  });
});
