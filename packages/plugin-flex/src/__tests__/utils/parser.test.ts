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

  describe('_prepareFlags', () => {
    it('should duplicate alias', () => {
      const options = {
        flags: {
          str: {
            required: true,
            name: 'original',
            alias: 'duplicate',
          },
        },
      };

      // @ts-ignore
      const updated = parser._prepareFlags(options);
      expect(Object.keys(options.flags)).toHaveLength(2);
      // @ts-ignore
      expect(updated.flags.str).toEqual(options.flags.str);
      // @ts-ignore
      expect(updated.flags.duplicate).toEqual(options.flags.str);
    });

    it('should not duplicate if non exists', () => {
      const options = {
        flags: {
          str: {
            required: true,
            name: 'original',
          },
        },
      };

      // @ts-ignore
      const updated = parser._prepareFlags(options);

      // @ts-ignore
      expect(Object.keys(updated.flags)).toHaveLength(1);
      // @ts-ignore
      expect(updated.flags.str).toEqual(options.flags.str);
    });
  });

  describe('_combineFlags', () => {
    const alias = 'alias-key';
    const original = 'original-key';

    it('should do nothing if no duplicate exists', () => {
      const parsed = {
        flags: {
          str: [original],
        },
      };
      const options = {
        flags: {
          str: {
            required: true,
          },
        },
      };

      // @ts-ignore
      const combined = parser._combineFlags(parsed, options);

      expect(combined.flags.str).toEqual([original]);
    });

    it('should copy over duplicate to the main', () => {
      const parsed = {
        flags: {
          duplicate: [alias],
        },
      };
      const options = {
        flags: {
          str: {
            required: true,
            alias: 'duplicate',
          },
          duplicate: {
            required: true,
            alias: 'duplicate',
          },
        },
      };

      // @ts-ignore
      const combined = parser._combineFlags(parsed, options);

      expect(Object.keys(combined.flags)).toHaveLength(1);
      // @ts-ignore
      expect(combined.flags.str).toEqual([alias]);
    });

    it('should merge both', () => {
      const parsed = {
        flags: {
          str: [original],
          duplicate: [alias],
        },
      };
      const options = {
        flags: {
          str: {
            required: true,
            alias: 'duplicate',
          },
          duplicate: {
            required: true,
            alias: 'duplicate',
          },
        },
      };

      // @ts-ignore
      const combined = parser._combineFlags(parsed, options);

      expect(Object.keys(combined.flags)).toHaveLength(1);
      // @ts-ignore
      expect(combined.flags.str).toEqual([original, alias]);
    });
  });
});
