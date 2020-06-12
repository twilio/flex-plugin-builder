const { expect } = require('chai');

const generalUtils = require('../../src/utils/general');

describe('Utils/General', () => {
  it('should create description that is not in directory', () => {
    const description = generalUtils.createDescription('   the description   ', false);

    expect(description).to.equal('the description.');
  });

  it('should create description that is in directory', () => {
    const description = generalUtils.createDescription('   the description   ', true);

    expect(description).to.equal(`the description. ${generalUtils._runInformation}`);
  });
});
