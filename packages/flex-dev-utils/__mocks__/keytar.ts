
'use strict';

module.exports = {
  findCredentials: (service: string) => Promise.resolve([]),
  setPassword: (service: string, account: string, password: string) => Promise.resolve(),
  deletePassword: (service: string, account: string) => Promise.resolve(true)
};
