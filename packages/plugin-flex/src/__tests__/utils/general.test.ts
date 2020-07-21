import { expect } from 'chai';
import { TwilioApiError, TwilioError } from 'flex-plugins-utils-exception';

import * as generalUtils from '../../utils/general';

describe('Utils/General', () => {
  it('should create description that is not in directory', () => {
    const description = generalUtils.createDescription('   the description   ', false);

    expect(description).to.equal('the description.');
  });

  it('should create description that is in directory', () => {
    const description = generalUtils.createDescription('   the description   ', true);

    expect(description).to.equal(`the description. ${generalUtils._runInformation}`);
  });

  describe('instanceOf', () => {
    it('should return true for instanceOf', () => {
      const apiError = new TwilioApiError(123, 'test', 123);
      const error = new TwilioError();

      expect(generalUtils.instanceOf(apiError, TwilioApiError)).to.equal(true);
      expect(generalUtils.instanceOf(apiError, TwilioError)).to.equal(true);
      expect(generalUtils.instanceOf(apiError, Error)).to.equal(true);

      expect(generalUtils.instanceOf(error, TwilioError)).to.equal(true);
      expect(generalUtils.instanceOf(error, Error)).to.equal(true);
    });

    it('should return false for instanceOf', () => {
      class Foo extends Error {}

      const apiError = new TwilioApiError(123, 'test', 123);
      const error = new TwilioError();

      expect(generalUtils.instanceOf(apiError, Foo)).to.equal(false);
      expect(generalUtils.instanceOf(error, Foo)).to.equal(false);
    });
  });
});
