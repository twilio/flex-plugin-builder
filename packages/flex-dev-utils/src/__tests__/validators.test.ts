import * as validators from '../validators';

describe('validators', () => {
  describe('isInputNotEmpty', () => {
    it('should return false', async () => {
      expect(await validators.isInputNotEmpty('')).toBeFalsy();
    });

    it('should return true', async () => {
      expect(await validators.isInputNotEmpty('1')).toBeTruthy();
    });
  });

  describe('validateAccountSid', () => {
    it('should return false', async () => {
      expect(await validators.validateAccountSid('')).toBeFalsy();
      expect(await validators.validateAccountSid('AC0000000000000000000000000000000'))
        .toEqual(expect.any(String));
      expect(await validators.validateAccountSid('AB00000000000000000000000000000000'))
        .toEqual(expect.any(String));
    });

    it('should return true', async () => {
      expect(await validators.validateAccountSid('AC00000000000000000000000000000000')).toBeTruthy();
    });
  });

  describe('validateApiSid', () => {
    it('should return false', async () => {
      expect(await validators.validateApiKey('')).toBeFalsy();
      expect(await validators.validateApiKey('SK0000000000000000000000000000000'))
        .toEqual(expect.any(String));
      expect(await validators.validateApiKey('SA0000000000000000000000000000000'))
        .toEqual(expect.any(String));
    });

    it('should return true', async () => {
      expect(await validators.validateApiKey('SK00000000000000000000000000000000')).toBeTruthy();
    });
  });

  describe('validateConfirmation', () => {
    it('should valid false if no default and no answer provided', async () => {
      expect(await validators.validateConfirmation()('')).toEqual(expect.any(String));
    });

    it('should valid false if incorrect answer is provided', async () => {
      expect(await validators.validateConfirmation()('blah')).toEqual(expect.any(String));
    });

    it('should valid truthy if answer is correct', async () => {
      expect(await validators.validateConfirmation()('yes')).toBeTruthy();
      expect(await validators.validateConfirmation()('YeS')).toBeTruthy();
      expect(await validators.validateConfirmation()('y')).toBeTruthy();
      expect(await validators.validateConfirmation()('Y')).toBeTruthy();
      expect(await validators.validateConfirmation()('no')).toBeTruthy();
      expect(await validators.validateConfirmation()('No')).toBeTruthy();
      expect(await validators.validateConfirmation()('N')).toBeTruthy();
      expect(await validators.validateConfirmation()('n')).toBeTruthy();
    });

    it('should be truthy if no answer is provided, but default is provided', async () => {
      expect(await validators.validateConfirmation('Y')('')).toBeTruthy();
      expect(await validators.validateConfirmation('N')('')).toBeTruthy();
    });
  });

  describe('isValidPluginName', () => {
    it('should be valid plugin names', () => {
      const names = [
        'plugin-foo',
        'plugin-foo-bar',
        'plugin-2',
        'plugin-foo_bar',
      ];

      names.map(validators.isValidPluginName)
        .forEach((resp) => expect(resp).toBeTruthy());
    });

    it('should be an invalid plugin names', () => {
      const names = [
        'plugin',
        'plugin-',
        'name',
        'name-plugin',
      ];

      names.map(validators.isValidPluginName)
        .forEach((resp) => expect(resp).toBeFalsy());
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

      data.map(validators.isValidUrl)
        .forEach((resp) => expect(resp).toBeTruthy());
    });

    it('should be invalid URL', () => {
      const data = [
        'htt://www.twilio.com',
        'http:/www.twilio.com',
        'twilio. com',
        'twilio',
      ];

      data.map(validators.isValidUrl)
        .forEach((resp) => expect(resp).toBeFalsy());
    });
  });

  describe('validateGitHubUrl', () => {
    it('invalid github url', () => {
      expect(validators.validateGitHubUrl(''))
        .toEqual(expect.stringContaining('valid URL'));

      expect(validators.validateGitHubUrl('http'))
        .toEqual(expect.stringContaining('valid URL'));

      expect(validators.validateGitHubUrl('https://twilio.com'))
        .toEqual(expect.stringContaining('GitHub'));
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
