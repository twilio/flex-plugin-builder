import { expect } from 'chai';
import { CLIParseError } from '@oclif/parser/lib/errors';

import * as parser from '../../utils/parser';

describe('Utils/Parser', () => {
  it('should trim only strings', () => {
    const obj = {
      str1: 'needs trimming ',
      str2: '  needs trimming  ',
      str3: 'is good',
      num: 123,
      bool: true,
      obj: {},
    };
    const trimmed = parser._trim(obj);

    expect(trimmed.str1).to.equal('needs trimming');
    expect(trimmed.str2).to.equal('needs trimming');
    expect(trimmed.str3).to.equal('is good');
    expect(trimmed.num).to.equal(123);
    expect(trimmed.bool).to.equal(true);
    expect(trimmed.obj).to.eql({});
  });

  describe('_validate', () => {
    const bool = {
      required: true,
      name: 'str',
    };

    it('should pass validation for no flags', () => {
      parser._validate({}, {});
    });

    it('should pass validation for flags', () => {
      const flags = { str: 'valid', bool: true };
      const options = {
        str: {
          required: true,
          name: 'str',
        },
        bool,
      };

      // @ts-ignore
      parser._validate(flags, options);
    });

    it('should pass validation for flags', () => {
      const flags = { str: 'valid', bool: true };
      const options = {
        str: {
          required: true,
          name: 'str',
          max: 100,
        },
        bool,
      };

      // @ts-ignore
      parser._validate(flags, options);
    });

    it('should should fail validation because flag is empty', (done) => {
      const flags = { str: '', bool: true };
      const options = {
        str: {
          required: true,
          name: 'str',
          max: 100,
        },
        bool,
      };

      try {
        // @ts-ignore
        parser._validate(flags, options);
      } catch (e) {
        expect(e).to.be.instanceOf(CLIParseError);
        expect(e.message).to.contain('cannot be empty');
        done();
      }
    });

    it('should should fail validation because flag is too small', (done) => {
      const flags = { str: 'entry', bool: true };
      const options = {
        str: {
          required: true,
          name: 'str',
          min: 100,
        },
        bool,
      };

      try {
        // @ts-ignore
        parser._validate(flags, options);
      } catch (e) {
        expect(e).to.be.instanceOf(CLIParseError);
        expect(e.message).to.contain('must be at least');
        expect(e.message).to.contain(`${options.str.min}`);
        done();
      }
    });

    it('should should fail validation because flag is too large', (done) => {
      const flags = { str: 'large entry', bool: true };
      const options = {
        str: {
          required: true,
          name: 'str',
          max: 5,
        },
        bool,
      };

      try {
        // @ts-ignore
        parser._validate(flags, options);
      } catch (e) {
        expect(e).to.be.instanceOf(CLIParseError);
        expect(e.message).to.contain('cannot be longer');
        expect(e.message).to.contain(`${options.str.max}`);
        done();
      }
    });
  });
});
