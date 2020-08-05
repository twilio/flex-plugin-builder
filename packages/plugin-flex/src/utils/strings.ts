import startCase from 'lodash.startcase';

const KEY_CASE_OVERWRITE = {
  sid: 'SID',
  datecreated: 'Created',
  dateupdated: 'Updated',
  isprivate: 'Access',
  isactive: 'Status',
  url: 'URL',
};

type NullUndefined = null | undefined | unknown;
// eslint-disable-next-line @typescript-eslint/ban-types
type Primitive = number | string | object;

/**
 * Converts a string from camelCase to Sentence Case
 * @param key
 */
export const toSentenceCase = (key: string): string => {
  if (key.toLowerCase() in KEY_CASE_OVERWRITE) {
    return KEY_CASE_OVERWRITE[key.toLowerCase()];
  }

  const split = startCase(key).split(' ');
  if (split.length <= 1) {
    return split.join(' ');
  }

  return split.map(toSentenceCase).join(' ');
};

/**
 * Returns true if value is null or undefined
 * @param value the value to check
 */
export const isNullOrUndefined = (value?: NullUndefined | Primitive) => value === undefined || value === null;
