/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars */
import * as matchers from './matchers';
import * as scripts from './utils';

declare const utils: typeof scripts;

declare global {
  namespace NodeJS {
    interface Global {
      utils: typeof scripts;
    }
  }

  namespace jest {
    interface Matchers<R> {
      toMatchPath: InstanceType<typeof matchers.ToMatchPath>['match'];
      toMatchPathContaining: InstanceType<typeof matchers.ToMatchPathContaining>['match'];
    }

    interface Expect {
      toMatchPath: typeof matchers.toMatchPath;
      toMatchPathContaining: typeof matchers.toMatchPathContaining;
    }
  }
}

if (expect) {
  const extensions = Object.keys(matchers)
    .filter((k) => k.charAt(0).toLocaleLowerCase() === k.charAt(0))
    .reduce((extension, key) => {
      // eslint-disable-next-line import/namespace, @typescript-eslint/no-explicit-any
      extension[key] = (actual: any, ...expected: any[]) => matchers[key](actual).match(...expected);
      return extension;
    }, {});
  expect.extend(extensions);

  // @ts-ignore
  global.utils = scripts;
} else {
  // eslint-disable-next-line no-console
  console.error("Unable to find Jest's global expect");
}
