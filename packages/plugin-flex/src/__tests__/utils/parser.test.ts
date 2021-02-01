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

    expect(trimmed.str1).toEqual('needs trimming');
    expect(trimmed.str2).toEqual('needs trimming');
    expect(trimmed.str3).toEqual('is good');
    expect(trimmed.num).toEqual(123);
    expect(trimmed.bool).toEqual(true);
    expect(trimmed.obj).toEqual({});
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
        expect(e).toBeInstanceOf(CLIParseError);
        expect(e.message).toContain('cannot be empty');
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
        expect(e).toBeInstanceOf(CLIParseError);
        expect(e.message).toContain('must be at least');
        expect(e.message).toContain(`${options.str.min}`);
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
        expect(e).toBeInstanceOf(CLIParseError);
        expect(e.message).toContain('cannot be longer');
        expect(e.message).toContain(`${options.str.max}`);
        done();
      }
    });
  });
});
